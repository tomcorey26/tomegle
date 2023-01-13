import express from 'express';
import http from 'http';
import cors from 'cors';
import { config } from 'dotenv';
import { Server } from 'socket.io';

config();
const port = 8080;
const app = express();

// Im not really sure if this and the
// app.use below are both needed. but I can just
// figure that out later
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
