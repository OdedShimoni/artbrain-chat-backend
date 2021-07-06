const {
    routeOngoingMessages,
    sendPrevMessagesToSocket,
    sendPrevMessagesOfVisitorToSocket,
    logVisitorsTo
 } = require('./socketEvents/index');

const visitors = [];
function funnelAndSave(io, socket) {
    socket.on('support entered', () => {
        console.log('support entered');
    
        sendPrevMessagesToSocket(socket);
    
        socket.on("disconnect", () => {
            console.log("Support disconnected.");
        });
    });
    
    socket.on('visitor entered', () => {
        logVisitorsTo(visitors, socket);
        const visitor_ip = socket.handshake.address;
        sendPrevMessagesOfVisitorToSocket(socket, visitor_ip);
    });
    
    routeOngoingMessages(io, socket, visitors);
}

module.exports = funnelAndSave;