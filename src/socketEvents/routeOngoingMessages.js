const saveMessage = require('./../helpers/saveMessage');

function sendOngoingMessages(io, socket, visitors) {
    socket.on(
        'visitor sent message',
        data => {
            const message = {
                ip: socket.handshake.address,
                text: data.text,
                sentBySupport: false
            }
            socket.broadcast.emit('visitor sent message', message); // emit to frontend admin
            saveMessage(message);
        }
    ); // maybe should be inside 'support entered' but not working for some reason

    socket.on('support sent message', data => {
        const message = {
            ip: data.ip,
            text: data.text,
            sentBySupport: true
        };
        io.to(getSocketIdByIp(visitors, data.ip))
            .emit('support sent message', message); // emit to frontend visitor
        saveMessage(message)
    }); // maybe should be inside 'support entered' but not working for some reason
}

function getSocketIdByIp(visitors, ip) {
    console.log('visitors: ', visitors);    
    console.log('visitors length: ', visitors.length);
    for(let i = 0; i < visitors.length; i++) {
        console.log('******** checking ip ', visitors[i].ip);
        if (visitors[i].ip === ip) {
            return visitors[i].socket_id;
        }
    }
    return -1;
}

module.exports = sendOngoingMessages;