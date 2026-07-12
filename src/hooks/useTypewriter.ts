import { useEffect, useState, useRef } from 'react'

/**
 * Simulates a terminal-style typing animation.
 *
 * @param text       Full string to type out.
 * @param speedMs    Delay between each character (default 80 ms).
 * @param startDelay Initial delay before typing begins (default 400 ms).
 * @returns { displayed, isDone } — current visible substring and whether typing finished.
 */
export function useTypewriter(
  text: string,
  speedMs = 80,
  startDelay = 400,
): { displayed: string; isDone: boolean } {
  const [displayed, setDisplayed] = useState('')
  const done = useRef(false)

  useEffect(() => {
    done.current = false
    setDisplayed('')

    let i = 0
    let startTimer: ReturnType<typeof setTimeout>
    let typeTimer: ReturnType<typeof setInterval>

    startTimer = setTimeout(() => {
      typeTimer = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(typeTimer)
          done.current = true
        }
      }, speedMs)
    }, startDelay)

    return () => {
      clearTimeout(startTimer)
      clearInterval(typeTimer)
    }
  }, [text, speedMs, startDelay])

  // Derive isDone from displayed length to ensure React re-renders with correct value
  const isDone = displayed.length === text.length && text.length > 0
  return { displayed, isDone }
}
