import { useRef, useLayoutEffect, useState, useCallback } from 'react'
import invariant from 'tiny-invariant'

interface ScrollOpts {
  scrollToBottomThreshold?: number
}

const nullRefMsg =
  'useChatScroll must be passed a ref to an element that exists in the DOM'

export function useChatScroll<T extends Element>({
  scrollToBottomThreshold = 100
}: ScrollOpts = {}) {
  const ref = useRef<T>(null)
  const [scrolledAboveThreshold, setScrolledAboveThreshold] = useState(false)

  const scrollToBottom = (options: Partial<ScrollToOptions> = {}) => {
    invariant(ref.current, nullRefMsg)

    ref.current.scrollTo({
      top: ref.current.scrollHeight,
      behavior: 'smooth',
      ...options
    })
  }

  const checkIfScrolledAboveThreshold = useCallback(() => {
    invariant(ref.current, nullRefMsg)

    const { scrollTop, scrollHeight, clientHeight } = ref.current

    const isOverflowing = scrollHeight > clientHeight

    const scrollDistFromBottom = scrollHeight - (clientHeight + scrollTop)

    if (isOverflowing && scrollDistFromBottom > scrollToBottomThreshold) {
      setScrolledAboveThreshold(true)
    } else {
      setScrolledAboveThreshold(false)
    }
  }, [scrollToBottomThreshold])

  const onScroll = () => {
    checkIfScrolledAboveThreshold()
  }

  useLayoutEffect(() => {
    invariant(ref.current, nullRefMsg)

    const observer = new ResizeObserver((entries) => {
      entries.forEach(() => {
        checkIfScrolledAboveThreshold()
      })
    })

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [checkIfScrolledAboveThreshold])

  const chatScrollerProps = {
    ref,
    onScroll
  }

  return { scrollToBottom, chatScrollerProps, scrolledAboveThreshold }
}
