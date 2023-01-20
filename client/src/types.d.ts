type Friend = {
  id: string
  username: string
  unread: boolean
  latestMessage: {
    text: string
    time: string
  }
}

type ChatMessage = {
  id: string
  text: string
  time: string
  sender: string
}

type ChatConversation = {
  id: string
  messages: Message[]
}
