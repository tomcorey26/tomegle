export const Chat = () => {
  // create a grid in tailwind
  // of 2 boxes on the left with 1/2 height
  // and 1 box on the right with full height
  return (
    <div className="grid h-screen grid-cols-3 grid-rows-2">
      <div className="col-span-2 bg-red-500"></div>
      <div className="col-span-1 row-span-2 bg-green-500"></div>
      <div className="col-span-2 bg-blue-500"></div>
    </div>
  )
}
