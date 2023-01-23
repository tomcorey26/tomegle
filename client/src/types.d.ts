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

type ChatMessage = {
  id: string
  text: string
  sender: string
  date: string
}
