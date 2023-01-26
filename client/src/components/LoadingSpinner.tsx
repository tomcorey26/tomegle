import React from 'react'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
}

export const LoadingSpinner = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-40 w-40 animate-spin rounded-full border-t-8 border-red-400"></div>
    </div>
  )
}
