export function Home() {
  return (
    <div>
      <Hero />
    </div>
  )
}

function Hero() {
  return (
    <div className="bg-gray-900 py-32">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-100 sm:text-4xl sm:leading-10">
            Video Chat with people
            <br />
            <span className="text-teal-500">with Tomegle</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-lg leading-7 text-gray-300 sm:mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at
            ipsum eu nunc commodo posuere et sit amet ligula.
          </p>
          <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center lg:justify-start">
            <div className="mx-auto rounded-md shadow">
              <a
                href="#"
                className="focus:shadow-outline-teal flex w-full items-center justify-center rounded-md border border-transparent bg-teal-500 px-8 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out hover:bg-teal-400 focus:border-teal-700 focus:outline-none md:py-4 md:px-10 md:text-lg"
              >
                Start Chatting Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
