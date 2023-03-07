import React, { useLayoutEffect, useState } from 'react'
import { For } from '@/components/For'
import { useChatScroll } from '@/hooks/useScrollToBottom'
import { usePreviousState } from '@/hooks/usePreviousState'
import { socket } from '@/socket'

type ChatMessengerProps = {
  conversationId?: string
  messages: UserMessage[]
  onMessage: (text: string) => void
  className?: string
  disabledForm?: boolean
}

// when they have a new message and we are above the threshold, we dont want to scroll to the bottom
// when they are above the threshold and there is a new message, we want to indicate that there is a new message
// we want to save where they are scrolled to
// when they have a new message and we are below the threshold, we want to scroll to the bottom

export function ChatMessenger({
  conversationId,
  messages,
  onMessage,
  className = '',
  disabledForm = false
}: ChatMessengerProps) {
  const prevConversationId = usePreviousState(conversationId)

  const { chatScrollerProps, scrolledAboveThreshold, scrollToBottom } =
    useChatScroll<HTMLUListElement>()

  const addMessage = (text: string) => {
    onMessage(text)
  }

  useLayoutEffect(() => {
    // TODO: have the scroll be preserved when switching conversations
    if (prevConversationId !== conversationId) {
      scrollToBottom({ behavior: 'auto' })
      return
    }

    if (scrolledAboveThreshold) return

    scrollToBottom({ behavior: 'smooth' })
  }, [
    messages,
    scrollToBottom,
    scrolledAboveThreshold,
    prevConversationId,
    conversationId
  ])

  return (
    <div className={`relative flex flex-col p-5 ${className}`}>
      {/* TODO: show new message count for any messages */}
      {/* sent when above threshhold */}
      {scrolledAboveThreshold && (
        <button
          onClick={() => scrollToBottom()}
          className="bg-primary absolute top-9 left-1/2 mb-3 -translate-x-1/2 rounded-lg py-2 px-4 text-white"
        >
          Back to bottom
        </button>
      )}
      <ul className=" h-0 grow overflow-y-scroll p-3" {...chatScrollerProps}>
        <For each={messages}>
          {(message) => (
            <ChatMessage key={message.id} message={message}>
              {message.text}
            </ChatMessage>
          )}
        </For>
      </ul>

      <ChatForm disabled={disabledForm} addMessage={addMessage} />
    </div>
  )
}

type ChatFormProps = {
  addMessage: (text: string) => void
  disabled?: boolean
}

function ChatForm({ addMessage, disabled }: ChatFormProps) {
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
        type="text"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="mr-2 w-full resize-none rounded-lg p-2"
        placeholder="Enter your message"
        disabled={disabled}
      />

      <div className="self-end">
        <button
          type="submit"
          className="bg-primary rounded-lg py-2 px-4 text-white"
          disabled={input.trim() === '' || disabled}
        >
          Send
        </button>
      </div>
    </form>
  )
}

type ChatMessageProps = {
  message: UserMessage
}
function ChatMessage({
  children,
  message: { senderId, timestamp }
}: React.PropsWithChildren<ChatMessageProps>) {
  const classArray = []

  let label = ''
  if (senderId === socket.id) {
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
  }).format(new Date(timestamp))

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
