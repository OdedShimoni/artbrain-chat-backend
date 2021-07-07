const socketIo = require("socket.io");
const deleteByVal = require('./helpers/deleteByVal');
const MessagesAPI = require('./MessagesAPI');

class Chat {
    server;
    io;
    visitors = [];
    messagesClient = new MessagesAPI;

    constructor(server) {
        this.server = server;
    }
    
    init() {
        const { server } = this;
        const corsAllowedOrigins = 
            ( (process.env.NODE_ENV === 'development')
                ? '*'
                : [process.env.CLIENT_VISITOR_URI, process.env.CLIENT_ADMIN_URI]
            );
        this.io = socketIo(
            server, {
            cors: {
                origin: corsAllowedOrigins,
            }
        });
        
        this.io.on("connection", (socket) => {
            this.sendConversationAndFunnel(socket);
        });
    }
    
    sendConversationAndFunnel(socket) {
        socket.on('support entered', () => {
            this.sendAllPreviousConversationsTo(socket);
        });
        
        socket.on('visitor entered', () => {
            this.logVisitorFrom(socket);
            this.sendPreviousConversationTo(socket);
        });
        
        this.funnel(socket);
    }

    funnel(socket) {
        /**
         * Whenever receiving a message from client,
         * sends it to the other client and saves to messages API
         */
        const { io, visitors, messagesClient } = this;
        
        socket.on('visitor sent message', data => {
            const message = {
                ip: socket.handshake.address,
                text: data.text,
                sentBySupport: false
            }
            socket.broadcast.emit('visitor sent message', message); // emit to all frontend admins
            messagesClient.save(message);
        });
    
        socket.on('support sent message', data => {
            const message = {
                ip: data.ip,
                text: data.text,
                sentBySupport: true
            };

            const socketId = visitors[data.ip] || -1;
            io
                .to(socketId)
                .emit('support sent message', message); // emit to relevant frontend visitor
                messagesClient.save(message)
        });
    }

    logVisitorFrom(socket) {
        /**
         * Follow current visitor status
         */
        this.visitors[socket.handshake.address] = socket.id;
        console.log("Visitor connected: visitors is ", this.visitors);
    
        socket.on("disconnect", () => {
            deleteByVal(socket.id, this.visitors);
            console.log("Visitor disconnected: visitors is ", this.visitors);
        });
    }
    
    sendPreviousConversationTo(socket) {
        const { messagesClient } = this;
        const visitor_ip = socket.handshake.address;
        messagesClient.getAllOf(visitor_ip)
            .then(prevMessages => {
                socket.emit('previous messages downloaded', prevMessages); // emit to frontend visitor
        });
    }

    sendAllPreviousConversationsTo(socket) {
        const { messagesClient } = this;
        messagesClient.getAll()
                .then(prevMessages => {
                    socket.emit('previous messages downloaded', prevMessages); // emit to frontend visitor
            });
    }

}

module.exports = Chat;