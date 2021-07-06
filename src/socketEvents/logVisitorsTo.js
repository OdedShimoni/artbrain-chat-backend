function logVisitorsTo(visitors, socket) {
    visitors.push(
        {
            ip: socket.handshake.address,
            socket_id: socket.id
        }
    )
    console.log("Visitor connected: visitors is ", visitors);

    socket.on("disconnect", () => {
        for(let i=0; i<visitors.length; i++) {
            if(visitors[i].socket_id === socket.id) {
                visitors.splice(i, 1);
            }
        }
        console.log("Visitor disconnected: visitors is ", visitors);
    });
}

module.exports = logVisitorsTo;