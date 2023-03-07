interface SocketUser {
  socketId: string
}

interface User {
  id: string
  name: string
  username: string
  avatar: string
  email: string
}

interface FriendConversation extends User {
  unread: boolean
  latestMessage: {
    text: string
    time: string
  }
  messages: ChatMessage[]
}

interface UserMessage {
  id: Uuid
  senderId: Uuid
  text: string
  timestamp: number
}
