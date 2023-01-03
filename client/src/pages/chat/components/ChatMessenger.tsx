import React, { useState } from 'react'
import { For } from 'components/For'

type Message = {
  text: string
  sender: 'me' | 'them'
  id: string
  date: Date
}

export function ChatMessenger() {
  const [messages, setMessages] = useState<Message[]>([])

  const addMessage = (text: string) => {
    const message: Message = {
      text,
      sender: 'me',
      id: crypto.randomUUID(),
      date: new Date()
    }
    setMessages([...messages, message])
  }

  return (
    <div className="flex h-full flex-col">
      <ul className="grow overflow-y-scroll p-3">
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
    addMessage(input.trim())
  }

  return (
    <form
      onSubmit={wrappedHandleSubmit}
      className="rounded-lg bg-gray-200 p-4 shadow-lg"
    >
      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="w-full rounded-lg p-2"
        placeholder="Enter your message"
      />
      <button type="submit" className="rounded-lg bg-blue-500 p-2 text-white">
        Send
      </button>
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
  }).format(date)

  return (
    <li
      tabIndex={0}
      className={`my-3 max-w-prose rounded-lg bg-white p-3 shadow-lg ${className}`}
    >
      <p className="font-bold">{label}</p>
      {children}
      <p className="text-xs text-gray-500">{formattedDate}</p>
    </li>
  )
}
