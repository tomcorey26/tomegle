import { useState } from 'react'

import { FriendList } from 'pages/friend-chat/components/FriendList'

const friend: Friend = {
  id: '1',
  username: 'test',
  latestMessage: {
    text: 'hi',
    time: new Date().toISOString()
  },
  unread: false
}

const friend2: Friend = {
  id: '2',
  username: 'bob',
  latestMessage: {
    text: 'hi',
    time: new Date().toISOString()
  },
  unread: true
}

export const FriendChat = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null)

  const [friends, setFriends] = useState<Friend[]>([friend, friend2])

  function handleConversationSelect(id: string | null) {
    setFriends((prev) =>
      prev.map((friend) => ({
        ...friend,
        unread: friend.id === id ? false : friend.unread
      }))
    )
    setSelectedConversationId(id)
  }

  return (
    <div className="grid md:grid-cols-3">
      <FriendList
        friends={friends}
        selectedConversationId={selectedConversationId}
        onSelectConversation={handleConversationSelect}
      />

      <div className="col-span-2 hidden bg-gray-200 md:block">
        <div className="flex h-full items-center justify-center">
          <div className="text-2xl text-gray-600">
            Select a conversation to start chatting
          </div>
        </div>
      </div>
    </div>
  )
}
