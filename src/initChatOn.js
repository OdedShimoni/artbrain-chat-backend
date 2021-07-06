const socketIo = require("socket.io");
const funnelAndSave = require("./funnelAndSave");

function initSocketIo(server) {
    const corsAllowedOrigins = (process.env.NODE_ENV === 'development'
        ? '*'
        : [process.env.CLIENT_VISITOR_URI, process.env.CLIENT_ADMIN_URI]
    );
    const io = socketIo(
        server, {
        cors: {
            origin: corsAllowedOrigins,
        }
    });
    
    io.on("connection", (socket) => {
        funnelAndSave(io, socket);
    });
}

module.exports = initSocketIo;