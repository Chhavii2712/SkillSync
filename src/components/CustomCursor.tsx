import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  useEffect(() => {
    // Current real mouse position
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2

    // Lagged position for the square (spring effect)
    let curX = mouseX
    let curY = mouseY

    // Faster lag for the small dot
    let dotX = mouseX
    let dotY = mouseY

    let rafId: number

    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor

    const animate = () => {
      // Square follows with heavy spring lag
      curX = lerp(curX, mouseX, 0.10)
      curY = lerp(curY, mouseY, 0.10)

      // Dot follows faster
      dotX = lerp(dotX, mouseX, 0.35)
      dotY = lerp(dotY, mouseY, 0.35)

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${curX}px, ${curY}px)`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX}px, ${dotY}px)`
      }

      rafId = requestAnimationFrame(animate)
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onMouseDown = () => setIsClicking(true)
    const onMouseUp = () => setIsClicking(false)

    // Detect hover on interactive elements
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button' ||
        target.style.cursor === 'pointer' ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseover', onMouseOver)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      {/* The lagging square outline */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? '48px' : '28px',
          height: isHovering ? '48px' : '28px',
          border: '2px solid #000',
          borderRadius: isHovering ? '50%' : '4px',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'width 0.25s ease, height 0.25s ease, border-radius 0.25s ease, opacity 0.2s ease',
          opacity: isClicking ? 0.5 : 1,
          mixBlendMode: 'normal',
          backgroundColor: isHovering ? 'rgba(0,0,0,0.05)' : 'transparent',
          willChange: 'transform',
        }}
      />

      {/* The fast small dot in the center */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? '6px' : '5px',
          height: isHovering ? '6px' : '5px',
          backgroundColor: isHovering ? '#3B82F6' : '#000',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'width 0.2s ease, height 0.2s ease, background-color 0.2s ease',
          willChange: 'transform',
        }}
      />
    </>
  )
}
