import React, { useLayoutEffect, useRef, useState } from 'react'
import { For } from 'components/For'
import { socket } from 'socket'
import { Message } from 'hooks/useChatMessenger'

type ChatMessengerProps = {
  messages: Message[]
  updateMessages: React.Dispatch<Message>
}

export function ChatMessenger({
  messages,
  updateMessages
}: ChatMessengerProps) {
  const messagesRef = useRef<HTMLUListElement>(null)

  useLayoutEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }

  const addMessage = (text: string) => {
    const message: Message = {
      text,
      sender: 'me',
      id: crypto.randomUUID(),
      date: new Date().toISOString()
    }
    socket.emit('my-message', message)
    updateMessages(message)
  }

  return (
    <div className="flex h-full flex-col p-5">
      <ul ref={messagesRef} className="grow overflow-y-scroll p-3">
        <For each={messages}>
          {(message) => (
            <ChatMessage key={message.id} message={message}>
              {message.text}
            </ChatMessage>
          )}
        </For>
      </ul>

      <ChatForm addMessage={addMessage} />
    </div>
  )
}

type ChatFormProps = {
  addMessage: (text: string) => void
}

function ChatForm({ addMessage }: ChatFormProps) {
  const [input, setInput] = useState<string>('')

  function wrappedHandleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (input.trim() === '') return
    addMessage(input.trim())
    setInput('')
  }

  return (
    <form
      onSubmit={wrappedHandleSubmit}
      className="flex rounded-lg border-2  border-gray-200 p-4 "
    >
      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="mr-2 w-full resize-none rounded-lg p-2"
        placeholder="Enter your message"
      />

      <div className="self-end">
        <button
          type="submit"
          className="rounded-lg bg-red-400 py-2 px-4 text-white"
        >
          Send
        </button>
      </div>
    </form>
  )
}

type ChatMessageProps = {
  message: Message
}
function ChatMessage({
  children,
  message: { sender, date }
}: React.PropsWithChildren<ChatMessageProps>) {
  const classArray = []

  let label = ''
  if (sender === 'me') {
    classArray.push('bg-red-400', 'text-white', 'ml-auto')
    label = 'Me'
  } else {
    classArray.push('bg-gray-300')
    label = 'Them'
  }

  const className = classArray.join(' ')

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric'
  }).format(new Date(date))

  return (
    <li
      tabIndex={0}
      className={`my-3 max-w-prose break-words rounded-lg p-3 shadow-lg ${className}`}
    >
      <p className="font-bold">{label}</p>
      {children}
      <p className="text-xs text-gray-500">{formattedDate}</p>
    </li>
  )
}
