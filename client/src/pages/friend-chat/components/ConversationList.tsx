import { clsx } from 'clsx'
import { useMemo, useState } from 'react'

type ConversationListProps = {
  conversations: FriendConversation[]
  selectedConversationId: string | null
  onSelectConversation: (id: string | null) => void
  className?: string
}

export const ConversationList = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  className = ''
}: ConversationListProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const unreadCount = conversations.filter((c) => c.unread).length

  const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setSearchTerm(e.target.value)
  }

  const filteredConversations = useMemo(() => {
    return conversations
      .filter((f) => f.username.includes(searchTerm))
      .sort(
        (a, b) =>
          new Date(b.latestMessage.time).getTime() -
          new Date(a.latestMessage.time).getTime()
      )
  }, [conversations, searchTerm])

  return (
    <div className={`relative flex h-full flex-col ${className}`}>
      <div className="flex items-center justify-between bg-white p-4">
        <h3>
          Messages
          <span className="text-primary ml-2 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium">
            {unreadCount}
          </span>
        </h3>
      </div>

      <div className="p-4">
        <label className="sr-only" htmlFor="search-input">
          Search
        </label>
        <input
          id="search-input"
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full rounded-md bg-gray-200 p-2"
        />
      </div>
      <ul className="overflow-y-auto" role="list" aria-label="List of friends">
        {filteredConversations.map((friend) => (
          <li
            key={friend.id}
            className={`border-b border-r border-gray-200 p-4 ${clsx({
              'border-l-primary': friend.id === selectedConversationId,
              'border-l-4': friend.id === selectedConversationId,
              'bg-gray-100': friend.id === selectedConversationId,
              'border-t': friend.id === filteredConversations[0].id
            })}
              transition-all duration-200 ease-in-out 
            `}
            onClick={() => onSelectConversation(friend.id)}
            tabIndex={0}
            onKeyUp={(e) => {
              if (e.key === 'Enter') onSelectConversation(friend.id)
            }}
            aria-current={friend.id === selectedConversationId}
          >
            <div className="flex items-center">
              <div
                className={`h-3 w-3 rounded-full ${
                  friend.unread ? 'bg-blue-500' : ''
                }`}
              />
              <div className={`mx-4 h-8 w-8 rounded-full bg-gray-300`}></div>
              <div className="text-gray-800">
                <div className="text-sm font-medium">{friend.username}</div>
                <div className="text-xs text-gray-600">
                  {friend.latestMessage.text}
                </div>
              </div>
              <div className="ml-auto text-xs text-gray-600">
                {new Date(friend.latestMessage.time).toLocaleTimeString()}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
