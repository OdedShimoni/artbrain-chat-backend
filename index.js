if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require("express");
const http = require("http");
const Chat = require('./src/Chat');
const routes = require('./src/routes/index');

const port = process.env.PORT || 3000;

const app = express();
app.use(routes.home);
app.use(routes.messages);

const server = http.createServer(app);
const chat = new Chat(server);
chat.init();
server.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;