const getMessagesOf = require("../helpers/getMessagesOf");

function sendPrevMessagesOfVisitorToSocket(socket, visitor_ip) {
    getMessagesOf(visitor_ip)
            .then(prevMessages => {
                socket.emit('previous messages downloaded', prevMessages); // emit to frontend visitor
           });
}

module.exports = sendPrevMessagesOfVisitorToSocket;