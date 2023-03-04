# Features

Start Search

1. Create a websocket connection to the server

2a. On Click, navigate to video chat finder page

3. On Page Navigation

(Sequentiallly)

- Connect to camera
- Connect to microphone
- send a request to the server to search/create a room
- on room join, send video and audio to server

2b. If is no open rooms, create a new room and connect websocket to the room  
2c. If is open rooms, join a room and connect websocket to the room

1.

- Server: On user connection to room, have each socket broadcast video and audio to all other sockets in the room
- Client: On video and audio receive, play video and audio

2d. When one person leaves the room, the room is not deleted

- On disconnect, end the video and audio stream for both clients and set loading to true
- Have the client who skipped the other person, send a request to the server to search for a room
- Have the client who stayed be shown a loading screen while they wait for another person to join

2d. When both people leave the room, the room is deleted

- Need to make sure the the db for the room is locked while the room is being deleted, so that no race conditions occur

## REST API Communication

POST /api/rooms - join/create a room
id - room id
users - array sockets ids

## Web Socket Communication

Client:

`search-room` - send a request to the server to search for a room

```ts
// CLIENT
socket.emit('search-room')

// SERVER
io.on('search-room', () => {
  // search for a room
  // if is no open rooms, create a new room
})
```

`join-room` - join a room

```ts
// CLIENT
socket.emit('join-room', { roomId: '123' })


- Send a request to the server to search for a room
- Connect to camera
- Connect to microphone
- send video and audio to server
- receive video and audio from server

Server:

- Create a room
```
