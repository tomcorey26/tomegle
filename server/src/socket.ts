import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';
import { v4 } from 'uuid';

type Uuid = string;

interface User {
  socketId: Uuid;
}

interface Room {
  users: User[];
}

type SocketId = Uuid;
type RoomId = Uuid;

export class ServerSocket {
  public static instance: ServerSocket;
  public io: Server;

  public users: Map<SocketId, User> = new Map();

  public rooms: Map<RoomId, Room> = new Map();
  public openRooms = new Set<RoomId>();

  constructor(server: HttpServer) {
    ServerSocket.instance = this;

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

    socket.on('handshake', (callback: (user: User) => void) => {
      console.info('Handhake received from client: ' + socket.id);

      const reconnectedUser = this.users.get(socket.id);

      if (reconnectedUser) {
        console.info('User reconnected: ' + socket.id);
        callback(reconnectedUser);
      }

      // Generate a new user
      const user = { socketId: socket.id };
      this.users.set(socket.id, user);

      callback(user);
    });

    // Random Chat Page - Join Room
    socket.on(
      'joinsert-room',
      (respond: (roomId: Uuid, users: User[]) => void) => {
        let roomId: Uuid;

        if (this.openRooms.size === 0) {
          // Create a new room
          roomId = v4();
          this.rooms.set(roomId, { users: [] });
          this.openRooms.add(roomId);
          console.info('New room created: ' + roomId);
        } else {
          // Join an existing room
          roomId = Array.from(this.openRooms)[0];
          console.info('Joining existing room: ' + roomId);
        }

        // Add user to room map and socket room
        const user = this.users.get(socket.id);
        const room = this.rooms.get(roomId);
        room.users.push(user);
        socket.join(roomId);

        // Remove room from open rooms if full (2 People Max)
        if (room.users.length === 2) {
          this.openRooms.delete(roomId);
        }

        // Send room id and users to client
        respond(roomId, room.users);
      }
    );

    // socket.on('leave-room', () => {
    //   this.handleDisconnectOrLeave(socket);
    // });

    // socket.on('disconnecting', () => {
    //   this.handleDisconnectOrLeave(socket);
    // });

    socket.on('message', (message: string) => {
      socket.broadcast.emit('message', message);
    });

    socket.on('my-message', (msg) => {
      msg.sender = 'them';
      socket.broadcast.emit('their-message', msg);
    });

    socket.on('disconnect', () => {
      console.info(`Socket disconnected: ${socket.id} `);

      const user = this.users.get(socket.id);

      if (user) {
        this.users.delete(socket.id);
      }
    });
  };

  // handleDisconnectOrLeave = (socket: Socket) => {
  //   const maybeCurrentRoom = socket.rooms[0];
  //   const room = this.rooms.get(maybeCurrentRoom);

  //   if (!room) {
  //     return -1;
  //   }

  //   const userIndex = room.users.findIndex((user) => user. === id);

  //   if (userIndex !== -1) {
  //     const roomId = socket.rooms[0];
  //     const user = rooms[roomId].users[userIndex];
  //     rooms[roomId].users.splice(userIndex, 1);

  //     if (isLeaving && rooms[roomId].users.length === 1) {
  //       const remainingUser = rooms[roomId].users[0];
  //       openRooms.add(remainingUser.roomId);
  //       spotsAvailable[remainingUser.roomId] = 1;
  //     }

  //     socket.leave(user.roomId);
  //   }
  // };
}
