import { useMemo, useState } from 'react'

type FriendsListProps = {
  friends: Friend[]
  selectedConversationId: string | null
  onSelectConversation: (id: string | null) => void
  className?: string
}

export const FriendList = ({
  friends,
  selectedConversationId,
  onSelectConversation,
  className = ''
}: FriendsListProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const unreadCount = friends.filter((f) => f.unread).length

  const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setSearchTerm(e.target.value)
  }

  const filteredFriends = useMemo(() => {
    return friends
      .filter((f) => f.username.includes(searchTerm))
      .sort(
        (a, b) =>
          new Date(b.latestMessage.time).getTime() -
          new Date(a.latestMessage.time).getTime()
      )
  }, [friends, searchTerm])

  return (
    <div className={`relative flex h-screen flex-col ${className}`}>
      <div className="flex items-center justify-between bg-white p-4">
        <h3>
          Messages
          <span className="ml-2 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
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
        {filteredFriends.map((friend) => (
          <li
            key={friend.id}
            className={`border-b border-gray-200 p-4 ${
              friend.id === selectedConversationId ? 'bg-gray-100' : ''
            }`}
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
