import { useEffect, useRef } from 'react'
import './HeroSection.css'

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2.5 + 0.5,
  delay: Math.random() * 5,
  duration: Math.random() * 4 + 3,
}))

export default function HeroSection({ onStart }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    // Draw animated palm lines on canvas
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    let frame = 0
    let animId

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const cx = canvas.width / 2
      const cy = canvas.height / 2 + 30
      const t = frame * 0.015

      ctx.lineWidth = 1.5
      ctx.lineCap = 'round'

      // Heart line
      ctx.beginPath()
      ctx.strokeStyle = `rgba(255, 107, 157, ${0.3 + Math.sin(t) * 0.15})`
      ctx.shadowBlur = 12
      ctx.shadowColor = '#ff6b9d'
      for (let x = -120; x <= 120; x++) {
        const px = cx + x
        const py = cy - 80 + Math.sin(x * 0.04 + t) * 10 + Math.sin(x * 0.015) * 20
        x === -120 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
      ctx.stroke()

      // Head line
      ctx.beginPath()
      ctx.strokeStyle = `rgba(167, 110, 255, ${0.35 + Math.sin(t + 1) * 0.15})`
      ctx.shadowColor = '#a76eff'
      for (let x = -110; x <= 110; x++) {
        const px = cx + x
        const py = cy - 20 + Math.sin(x * 0.05 + t * 0.8) * 8 + Math.sin(x * 0.02) * 15
        x === -110 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
      ctx.stroke()

      // Life line (arc)
      ctx.beginPath()
      ctx.strokeStyle = `rgba(64, 224, 208, ${0.3 + Math.sin(t + 2) * 0.1})`
      ctx.shadowColor = '#40e0d0'
      ctx.arc(cx + 40, cy + 60, 100 + Math.sin(t) * 5, Math.PI * 1.1, Math.PI * 1.8)
      ctx.stroke()

      ctx.shadowBlur = 0
      frame++
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <section className="hero">
      {/* Stars */}
      <div className="hero__stars">
        {PARTICLES.map(p => (
          <div
            key={p.id}
            className="hero__star"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Canvas palm lines */}
      <div className="hero__canvas-wrap">
        <canvas ref={canvasRef} className="hero__canvas" />
      </div>

      {/* Content */}
      <div className="hero__content">
        <div className="hero__badge">✦ AI-Powered Palmistry</div>

        <h1 className="hero__title">
          Read Your<br />
          <span className="gradient-text">Destiny</span><br />
          In Your Palm
        </h1>

        <p className="hero__subtitle">
          Upload a photo of your palm and let our AI analyze your unique
          palm lines — uncovering insights about your love life, career,
          and personality.
        </p>

        <div className="hero__features">
          <div className="hero__feature">
            <span className="hero__feature-icon">❤️</span>
            <span>Love & Relationships</span>
          </div>
          <div className="hero__feature">
            <span className="hero__feature-icon">💼</span>
            <span>Career & Success</span>
          </div>
          <div className="hero__feature">
            <span className="hero__feature-icon">🌟</span>
            <span>Personality Traits</span>
          </div>
        </div>

        <button className="btn btn-primary hero__cta" onClick={onStart} id="start-reading-btn">
          <span>✦</span>
          Begin Your Reading
          <span>→</span>
        </button>

        <p className="hero__disclaimer">
          Powered by OpenCV edge detection &amp; rule-based AI
        </p>
      </div>

      {/* Bottom fade */}
      <div className="hero__fade" />
    </section>
  )
}
