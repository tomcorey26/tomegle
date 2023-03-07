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

interface UserMessage {
  id: Uuid;
  senderId: Uuid;
  text: string;
  timestamp: number;
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
    socket.on('joinsert-room', () => {
      this.joinSertRoom(socket);
    });

    socket.on('skip-room', () => {
      this.leaveRoom(socket);
      this.joinSertRoom(socket);
    });

    socket.on('disconnecting', () => {
      console.info('Socket disconnecting: ' + socket.id);
      this.leaveRoom(socket);
    });

    socket.on('message', (messageText: string) => {
      // send to all clients in current room, besides sender
      const { roomId } = this.getCurrentRoom(socket);

      if (!roomId) {
        return;
      }

      const message: UserMessage = {
        id: v4(),
        senderId: socket.id,
        text: messageText,
        timestamp: Date.now(),
      };

      console.info(
        `User ${socket.id} sent message to room ${roomId}:`,
        messageText
      );

      this.io.to(roomId).emit('message', message);
    });

    socket.on('disconnect', () => {
      console.info(`Socket disconnected: ${socket.id} `);

      const user = this.users.get(socket.id);

      if (user) {
        this.users.delete(socket.id);
      }
    });
  };

  leaveRoom = (socket: Socket) => {
    const roomId = Array.from(socket.rooms).find((room) => room !== socket.id);
    if (!roomId) {
      return;
    }

    const room = this.rooms.get(roomId);

    // remove the user from the room
    const userIndex = room.users.findIndex(
      (user) => user.socketId === socket.id
    );
    if (userIndex !== -1) {
      room.users.splice(userIndex, 1);
      socket.leave(roomId);
    }

    // delete the room if it is empty
    if (room.users.length === 0) {
      console.info(`Deleting empty room ${roomId}`);
      this.rooms.delete(roomId);
      this.openRooms.delete(roomId);
    }

    // if the room is not full, add it to the open rooms
    // and notify the other user that the other user left
    if (room.users.length === 1) {
      console.info(`Adding room ${roomId} to open rooms`);
      this.openRooms.add(roomId);
      this.io.to(roomId).emit('room-update', roomId, room.users);
    }

    console.info(`User ${socket.id} left room ${roomId}`);
  };

  joinSertRoom = (socket: Socket) => {
    let roomId: Uuid;

    if (this.openRooms.size === 0) {
      // Create a new room yo
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
    console.info(`Adding user ${socket.id} to room ${roomId}`);
    room.users.push(user);
    socket.join(roomId);

    // Remove room from open rooms if full (2 People Max)
    if (room.users.length === 2) {
      this.openRooms.delete(roomId);
    }

    this.io.to(roomId).emit('room-update', roomId, room.users);
  };

  getCurrentRoom = (socket: Socket) => {
    const roomId = Array.from(socket.rooms).find((room) => room !== socket.id);
    if (!roomId) {
      return { roomId: null, room: null };
    }

    const room = this.rooms.get(roomId);
    return { roomId, room };
  };
}
