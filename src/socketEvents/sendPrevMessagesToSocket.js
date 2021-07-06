const getAllMessages = require("../helpers/getAllMessages");

function sendPrevMessagesToSocket(socket) {
    getAllMessages()
            .then(prevMessages => {
                socket.emit('previous messages downloaded', prevMessages); // emit to frontend visitor
           });
}

module.exports = sendPrevMessagesToSocket;