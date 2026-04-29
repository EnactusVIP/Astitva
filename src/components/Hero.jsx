import { useEffect, useRef } from 'react'

const PARTICLES = [
  { color: '#e8b8c8', size: 14, top: '15%', left: '8%',  dur: 9,  delay: 0   },
  { color: '#c8ce8f', size: 10, top: '70%', left: '12%', dur: 7,  delay: 2   },
  { color: '#9fb4cd', size: 18, top: '25%', left: '85%', dur: 11, delay: 1   },
  { color: '#ebb978', size: 8,  top: '60%', left: '80%', dur: 8,  delay: 3   },
  { color: '#e8b8c8', size: 12, top: '45%', left: '5%',  dur: 10, delay: 1.5 },
  { color: '#c8ce8f', size: 16, top: '80%', left: '70%', dur: 6,  delay: 0.5 },
  { color: '#9fb4cd', size: 9,  top: '10%', left: '55%', dur: 13, delay: 4   },
  { color: '#ebb978', size: 13, top: '50%', left: '92%', dur: 9,  delay: 2.5 },
]

export default function Hero({ onJoin }) {
  const bgRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!bgRef.current) return
      bgRef.current.style.backgroundPositionY = `calc(50% + ${window.scrollY * 0.4}px)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="hero" id="home">
      <div ref={bgRef} className="hero-bg" />
      <div className="hero-overlay" />

      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            background: p.color,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <div className="hero-content">
        <div className="hero-glass">
          <h1>
            <span>Project</span> <em>Astitva</em>
          </h1>
          <p>Exist as <em>you</em> are.</p>
          <div className="hero-buttons">
            <button className="join-btn" onClick={onJoin}>
              Join Community
            </button>
          </div>
        </div>
      </div>

      <div className="scroll-indicator" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  )
}
