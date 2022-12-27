import { ChatVideo } from './components/ChatVideo'

export const Chat = () => {
  return (
    <div className="grid h-screen grid-cols-3 grid-rows-2">
      <div className="col-span-2">
        {/* USER */}
        <ChatVideo />
      </div>
      <div className="col-span-1 row-span-2 "></div>
      <div className="col-span-2">
        <ChatVideo />
      </div>
    </div>
  )
}
