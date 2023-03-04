import { Link, useRouteError } from 'react-router-dom'

function ErrorPage() {
  const error = useRouteError()

  return (
    <div id="error-page">
      <div className="flex h-screen flex-col items-center justify-center bg-gray-200">
        <h1 className="text-4xl font-medium text-gray-800">Error</h1>
        <p className="mt-4 text-xl text-gray-600">
          Sorry, something went wrong.
        </p>
        {error instanceof Error && (
          <p>
            <i>{error.message}</i>
          </p>
        )}
        <Link
          to="/"
          className="mt-6 rounded-lg bg-blue-500 py-2 px-4 font-medium text-white hover:bg-blue-600"
        >
          Go back to homepage
        </Link>
      </div>
    </div>
  )
}

export default ErrorPage
