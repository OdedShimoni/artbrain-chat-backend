if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
import express from 'express';
import http from 'http';
import Chat from './src/Chat';
import routes from './src/routes/index';

const port = process.env.PORT || 3000;

const app = express();
app.use(routes.home);
app.use(routes.messages);

const server = http.createServer(app);
const chat = new Chat(server);
chat.init();
server.listen(port, () => console.log(`Listening on port ${port}`));

export default app;