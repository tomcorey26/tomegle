import { fakeFriendConversation } from 'fakes/friend-chat/friend-conversation'

// TODO: Replace this with a real API call
export const getConversations = async (userId: string) => {
  return Array.from({ length: 10 }, () => fakeFriendConversation())
}
