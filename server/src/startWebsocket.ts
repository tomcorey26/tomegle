import http from 'http';
import { Server } from 'socket.io';

interface ServerToClientEvents {
  users: Array<User>;
}

export function startWebsocket(
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) {
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
    const users = [];
    for (let [id, socket] of io.of('/').sockets) {
      users.push({});
    }

    socket.emit('users', users);
    socket.on('disconnect', () => {});

    socket.on('my-message', (msg) => {
      msg.sender = 'them';
      socket.broadcast.emit('their-message', msg);
    });
  });
}
