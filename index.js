if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require("express");
const http = require("http");
const initChatOn = require('./src/initChatOn');
const routes = require('./src/routes/index');

const port = process.env.PORT || 3000;

const app = express();
app.use(routes.home);
app.use(routes.messages);

const server = http.createServer(app);
initChatOn(server);
server.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;