import { Server as SocketServer, Socket } from "socket.io";
import http from 'http';
import { Message } from "./common/types";
import deleteByVal from './common/deleteByVal';
import MessagesAPI from './MessagesAPI';

class Chat {
    server: http.Server;
    io?: SocketServer;
    visitors: Map<string, string> = new Map;
    messagesClient: MessagesAPI = new MessagesAPI;

    constructor(server: any) {
        this.server = server;
    }
    
    init() {
        const { server } = this;
        const corsAllowedOrigins: any = 
            ( (process.env.NODE_ENV === 'development')
                ? '*'
                : [process.env.CLIENT_VISITOR_URI, process.env.CLIENT_ADMIN_URI]
            );
        this.io = new SocketServer(
            server, {
            cors: {
                origin: corsAllowedOrigins,
            }
        });
        
        this.io.on("connection", (socket) => {
            this.sendConversationAndFunnel(socket);
        });
    }
    
    sendConversationAndFunnel(socket: Socket): void {
        socket.on('support entered', () => {
            this.sendAllPreviousConversationsTo(socket);
        });
        
        socket.on('visitor entered', () => {
            this.logVisitorFrom(socket);
            this.sendPreviousConversationTo(socket);
        });
        
        this.funnel(socket);
    }

    funnel(socket: Socket): void {
        /**
         * Whenever receiving a message from client,
         * sends it to the other client and saves to messages API
         */
        const { io, visitors, messagesClient } = this;
        
        socket.on('visitor sent message', data => {
            const message: Message = {
                ip: socket.handshake.address,
                text: data.text,
                sentBySupport: false
            }
            socket.broadcast.emit('visitor sent message', message); // emit to all frontend admins
            messagesClient.save(message);
        });
    
        socket.on('support sent message', data => {
            const message: Message = {
                ip: data.ip,
                text: data.text,
                sentBySupport: true
            };

            const socketId: string = visitors.get(data.ip) || 'none';
            io?.to(socketId).emit('support sent message', message); // emit to relevant frontend visitor
            messagesClient.save(message)
        });
    }

    logVisitorFrom(socket: Socket) {
        /**
         * Follow current visitor status
         */
        this.visitors.set(socket.handshake.address, socket.id);
        console.log("Visitor connected: visitors is ", this.visitors);
    
        socket.on("disconnect", () => {
            deleteByVal(socket.id, this.visitors);
            console.log("Visitor disconnected: visitors is ", this.visitors);
        });
    }
    
    async sendPreviousConversationTo(socket: Socket) {
        const { messagesClient } = this;
        const visitorIp = socket.handshake.address;
        const previousClientMessages = await messagesClient.getAllOf(visitorIp);
        socket.emit('previous messages downloaded', previousClientMessages); // emit to frontend visitor
    }

    async sendAllPreviousConversationsTo(socket: Socket) {
        const { messagesClient } = this;
        const allPreviousMessages = await messagesClient.getAll();
        socket.emit('previous messages downloaded', allPreviousMessages); // emit to frontend visitor
    }

}

export default Chat;