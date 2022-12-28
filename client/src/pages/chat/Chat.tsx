import { UserVideo } from 'pages/chat/components/UserVideo'
import { ErrorBoundary } from 'react-error-boundary'

export const Chat = () => {
  return (
    <div className="grid h-screen grid-cols-3 grid-rows-2">
      <div className="col-span-2">
        <ErrorBoundary
          FallbackComponent={({ error }) => <div>{error.message}</div>}
        >
          <UserVideo />
        </ErrorBoundary>
      </div>
      <div className="col-span-1 row-span-2 "></div>
      <div className="col-span-2">
        {/* FRIEND */}
        {/* <ChatVideo /> */}
      </div>
    </div>
  )
}
