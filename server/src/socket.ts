import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';
import { v4 } from 'uuid';

type Uuid = string;

export class ServerSocket {
  public static instance: ServerSocket;
  public io: Server;

  public users: Record<Uuid, string> = {};

  constructor(server: HttpServer) {
    ServerSocket.instance = this;
    this.users = {};
    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 10000, // check every 10 seconds, to see if the client is still connected
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
      },
    });

    this.io.on('connect', this.StartListeners);

    // Auth
    this.io.use((socket, next) => {
      const user = socket.handshake.auth.user;
      if (!user) {
        return next(new Error('No user provided'));
      }
      next();
    });

    console.info('Socket server started');
  }

  StartListeners = (socket: Socket) => {
    console.info('Socket connected:', socket.id);
    // These are are all the events sent from the client

    socket.on('handshake', () => {});
    // socket.on('join', (username: string) => {
    //   const id = v4();
    //   this.users[id] = username;
    //   socket.emit('joined', id);
    //   this.io.emit('users', this.users);
    // });
    socket.on('message', (message: string) => {
      socket.broadcast.emit('message', message);
    });

    socket.on('my-message', (msg) => {
      msg.sender = 'them';
      socket.broadcast.emit('their-message', msg);
    });

    socket.on('disconnect', () => {
      console.info('Socket disconnected');
    });
  };
}
