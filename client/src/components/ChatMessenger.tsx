import React, { useLayoutEffect, useRef, useState } from 'react'
import { For } from '@/components/For'
import { useUser } from '@/hooks/useUser'

type ChatMessengerProps = {
  messages: ChatMessage[]
  updateMessages: React.Dispatch<ChatMessage>
  className?: string
}

export function ChatMessenger({
  messages,
  updateMessages,
  className = ''
}: ChatMessengerProps) {
  const user = useUser()

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
    const message: ChatMessage = {
      text,
      sender: user.id,
      id: crypto.randomUUID(),
      date: new Date().toISOString()
    }
    updateMessages(message)
  }

  return (
    <div className={`flex flex-col p-5 ${className}`}>
      <ul ref={messagesRef} className="h-0 grow overflow-y-scroll p-3">
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
          className="bg-primary rounded-lg py-2 px-4 text-white"
        >
          Send
        </button>
      </div>
    </form>
  )
}

type ChatMessageProps = {
  message: ChatMessage
}
function ChatMessage({
  children,
  message: { sender, date }
}: React.PropsWithChildren<ChatMessageProps>) {
  const classArray = []
  const user = useUser()

  let label = ''
  if (sender === user.id) {
    classArray.push('bg-primary', 'text-white', 'ml-auto')
    label = 'Me'
  } else {
    classArray.push('bg-gray-200')
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
