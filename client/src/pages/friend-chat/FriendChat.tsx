import { useEffect, useReducer } from 'react'

import { ConversationList } from 'pages/friend-chat/components/ConversationList'
import { ChatMessenger } from 'components/ChatMessenger'
import { useUser } from 'hooks/useUser'
import { getConversations } from 'api/friend-chat/getConversations'

type FriendChatState = {
  conversations: FriendConversation[]
  selectedFriendId: string | null
}

type FriendChatAction =
  | {
      type: 'select-conversation'
      friendId: string | null
    }
  | {
      type: 'update-conversations'
      conversations: FriendConversation[]
    }
  | {
      type: 'add-conversation-message'
      friendId: string
      message: ChatMessage
    }

type FriendChatReducer = (
  state: FriendChatState,
  action: FriendChatAction
) => FriendChatState

export const FriendChat = () => {
  const [chatState, dispatch] = useReducer<FriendChatReducer>(
    (prev, action) => {
      switch (action.type) {
        case 'select-conversation':
          return {
            ...prev,
            selectedFriendId: action.friendId,
            conversations: prev.conversations.map((friend) => ({
              ...friend,
              unread: friend.id === action.friendId ? false : friend.unread
            }))
          }

        case 'update-conversations':
          return {
            ...prev,
            conversations: action.conversations
          }

        case 'add-conversation-message':
          return {
            ...prev,
            conversations: prev.conversations.map((friend) => {
              if (friend.id === action.friendId) {
                return {
                  ...friend,
                  messages: [...friend.messages, action.message]
                }
              }
              return friend
            })
          }

        default:
          throw new Error('Invalid action passed to friend reducer')
      }
    },
    {
      conversations: [],
      selectedFriendId: null
    }
  )

  const user = useUser()

  const { conversations, selectedFriendId } = chatState

  useEffect(() => {
    ;(async () => {
      const conversations = await getConversations(user.id)
      dispatch({ type: 'update-conversations', conversations })
    })()
  }, [user])

  function handleConversationSelect(id: string | null) {
    dispatch({ type: 'select-conversation', friendId: id })
  }

  function addConversationMessage(message: ChatMessage, friendId: string) {
    dispatch({
      type: 'add-conversation-message',
      friendId,
      message
    })
  }

  const selectedConversation = conversations.find(
    (c) => c.id === selectedFriendId
  )

  return (
    <div className="grid h-full md:grid-cols-3">
      <ConversationList
        conversations={conversations}
        selectedConversationId={selectedFriendId}
        onSelectConversation={handleConversationSelect}
      />

      <div className="col-span-2 hidden bg-gray-200 md:block">
        {/* TODO: Figure out how to model chat and friend data */}
        {selectedConversation ? (
          <ChatMessenger
            className="h-full"
            messages={selectedConversation.messages}
            updateMessages={(message) =>
              addConversationMessage(message, selectedConversation.id)
            }
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-2xl text-gray-600">
              Select a conversation to start chatting
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
