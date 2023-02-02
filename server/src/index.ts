import express from 'express';
import http from 'http';
import cors from 'cors';
import { config } from 'dotenv';
import { Server } from 'socket.io';

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

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

io.use((socket, next) => {
  const user = socket.handshake.auth.user;
  if (!user) {
    return next(new Error('No user provided'));
  }
  next();
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {});

  socket.on('my-message', (msg) => {
    msg.sender = 'them';
    socket.broadcast.emit('their-message', msg);
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
