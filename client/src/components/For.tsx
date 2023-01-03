// create a react function component
// that takes in an array prop "for"
// and a function prop "children"
// and returns a react fragment
// that maps over the array prop "for"
// and calls the function prop "children"
// with the current item in the array
// and the index of the current item in the array
// and returns the result
// }

type ForProps<T> = {
  each: T[]
  children: (item: T, index: number) => React.ReactElement
}

export function For<T>({
  each: items,
  children
}: ForProps<T>): React.ReactElement {
  return <>{items.map((item, index) => children(item, index))}</>
}
