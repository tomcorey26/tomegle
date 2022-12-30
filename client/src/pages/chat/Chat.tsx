import { ChatMessenger } from 'pages/chat/components/ChatMessenger'
import { UserVideo } from 'pages/chat/components/UserVideo'
import { ErrorBoundary } from 'react-error-boundary'

export const Chat = () => {
  return (
    <div className="grid h-screen grid-cols-3 grid-rows-2">
      <div className="col-start-1 self-center">
        <ErrorBoundary
          FallbackComponent={({ error }) => <div>{error.message}</div>}
        >
          <UserVideo />
        </ErrorBoundary>
      </div>
      <div className="col-start-1 row-start-2 self-center">
        <ErrorBoundary
          FallbackComponent={({ error }) => <div>{error.message}</div>}
        >
          <UserVideo />
        </ErrorBoundary>
      </div>

      <div className="col-span-2 row-span-2">
        <ChatMessenger />
      </div>
    </div>
  )
}
