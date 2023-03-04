interface LoadingSpinnerProps {
  size?: '1/2screen' | 'small' | 'medium' | 'large' | 'xlarge'
}

export const LoadingSpinner = ({ size = 'medium' }) => {
  let height = 'h-40'
  let width = 'w-40'

  if (size === 'small') {
    height = 'h-10'
    width = 'w-10'
  } else if (size === 'medium') {
    height = 'h-40'
    width = 'w-40'
  } else if (size === 'large') {
    height = 'h-60'
    width = 'w-60'
  } else if (size === 'xlarge') {
    height = 'h-80'
    width = 'w-80'
  }

  const classes = `border-primary ${height} ${width} animate-spin rounded-full border-t-8`

  return <div className={classes}></div>
}
