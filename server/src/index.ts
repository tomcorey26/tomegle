import express from 'express';
import http from 'http';
import cors from 'cors';
import { config } from 'dotenv';
import { startWebsocket } from './startWebsocket.js';

config();
const port = 8080;

// TODO: replace with fastify
const app = express();

// Im not really sure if this and the
// app.use below are both needed. but I can just
// figure that out later
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

const server = http.createServer(app);

startWebsocket(server);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
