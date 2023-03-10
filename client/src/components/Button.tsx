type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

export const Button = (props: ButtonProps) => {
  return (
    <button className="bg-primary rounded-lg py-2 px-4 text-white" {...props} />
  )
}
