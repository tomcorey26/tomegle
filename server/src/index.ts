import express from 'express';
import http from 'http';
import cors from 'cors';
import { config } from 'dotenv';
import { ServerSocket } from './socket.js';

config();
const port = 8080;

// TODO: replace with fastify
const app = express();

const server = http.createServer(app);

new ServerSocket(server);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// log all requests
app.use((req, res, next) => {
  console.log(`Method: ${req.method}- Url${req.url}`);
  next();
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
