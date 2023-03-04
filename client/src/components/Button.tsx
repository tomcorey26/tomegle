type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

export const Button = (props: ButtonProps) => {
  return (
    <button
      className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
      {...props}
    />
  )
}
