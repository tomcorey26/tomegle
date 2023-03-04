import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';
import { v4 } from 'uuid';

type Uuid = string;

interface Room {
  users: Uuid[];
}

export class ServerSocket {
  public static instance: ServerSocket;
  public io: Server;

  public users: Record<Uuid, string> = {};

  public rooms: Map<Uuid, Room> = new Map();
  public openRooms = new Set<Uuid>();

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

    this.io.on('connect', this.startListeners);

    // Auth
    // this.io.use((socket, next) => {
    //   const user = socket.handshake.auth.user;
    //   if (!user) {
    //     return next(new Error('No user provided'));
    //   }
    //   next();
    // });

    console.info('Socket server started');
  }

  startListeners = (socket: Socket) => {
    console.info('Socket connected:', socket.id);
    // These are are all the events sent from the client

    socket.onAny((event, ...args) => {
      console.info('Socket event:', event, args);
    });

    socket.on('handshake', (callback: (uid: string) => void) => {
      console.info('Handhake received from client: ' + socket.id);

      const reconnected = Object.values(this.users).includes(socket.id);

      if (reconnected) {
        console.info('User reconnected: ' + socket.id);
        const uid = this.getUidFromSocketId(socket.id);

        if (uid) {
          console.info('Sending callback for reconnect...');
          callback(uid);
          return;
        }
      }

      // Generate a new user
      const uid = v4();
      this.users[uid] = socket.id;

      callback(uid);
    });

    // Random Chat Page - Join Room
    socket.on(
      'joinsert-room',
      (respond: (roomId: Uuid, users: Uuid[]) => void) => {
        const uid = this.getUidFromSocketId(socket.id);
        let roomId: Uuid;

        if (this.openRooms.size === 0) {
          roomId = v4();
          this.rooms.set(roomId, { users: [] });
          this.openRooms.add(roomId);
          console.info('New room created: ' + roomId);
        } else {
          roomId = Array.from(this.openRooms)[0];
          console.info('Joining existing room: ' + roomId);
        }

        const room = this.rooms.get(roomId);
        room.users.push(uid);
        socket.join(roomId);

        if (room.users.length === 2) {
          this.openRooms.delete(roomId);
        }

        respond(roomId, room.users);
      }
    );

    socket.on('message', (message: string) => {
      socket.broadcast.emit('message', message);
    });

    socket.on('my-message', (msg) => {
      msg.sender = 'them';
      socket.broadcast.emit('their-message', msg);
    });

    socket.on('disconnect', () => {
      console.info(`Socket disconnected: ${socket.id} `);

      const ui = this.getUidFromSocketId(socket.id);

      if (ui) {
        delete this.users[ui];
      }
    });
  };

  getUidFromSocketId = (socketId: string) => {
    return Object.keys(this.users).find((uid) => this.users[uid] === socketId);
  };
}
