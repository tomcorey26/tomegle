import { useState } from 'react'

export function ChatMessenger() {
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState<string>('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setMessages([...messages, input])
    setInput('')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="grow overflow-y-scroll">
        {messages.map((message, index) => (
          <div key={index} className="rounded-lg bg-white p-4 shadow-lg">
            {message}
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
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
    </div>
  )
}
