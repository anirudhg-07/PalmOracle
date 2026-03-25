import { useState, useEffect } from 'react'
import './ResultsSection.css'

const CARD_CONFIG = {
  love: {
    icon: '❤️',
    label: 'Love & Relationships',
    color: 'rose',
    line: 'Heart Line',
  },
  career: {
    icon: '💼',
    label: 'Career & Success',
    color: 'purple',
    line: 'Head Line',
  },
  personality: {
    icon: '🌟',
    label: 'Personality Traits',
    color: 'teal',
    line: 'Life Line',
  },
}

function ConfidenceBar({ value, color }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 300)
    return () => clearTimeout(t)
  }, [value])
  return (
    <div className="conf-bar">
      <div
        className={`conf-bar__fill conf-bar__fill--${color}`}
        style={{ width: `${width}%`, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </div>
  )
}

function PredictionCard({ type, data, delay }) {
  const cfg = CARD_CONFIG[type]
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div className={`pred-card glass pred-card--${cfg.color} ${visible ? 'pred-card--visible' : ''}`}>
      <div className="pred-card__header">
        <span className="pred-card__icon">{cfg.icon}</span>
        <div>
          <p className="pred-card__line">{cfg.line}</p>
          <h3 className="pred-card__label">{cfg.label}</h3>
        </div>
        <div className={`pred-card__level pred-card__level--${data.level}`}>
          {data.level.charAt(0).toUpperCase() + data.level.slice(1)}
        </div>
      </div>
      <p className="pred-card__text">{data.prediction}</p>
      <div className="pred-card__footer">
        <span className="pred-card__conf-label">
          Alignment: <strong>{data.confidence}%</strong>
        </span>
        <ConfidenceBar value={data.confidence} color={cfg.color} />
      </div>
    </div>
  )
}

export default function ResultsSection({ result, onReset }) {
  const { predictions, edge_image, metrics } = result
  const [showImage, setShowImage] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShowImage(true), 150)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="results-page">
      {/* Header */}
      <header className="results-header">
        <div className="results-header__brand gradient-text">✦ PalmOracle</div>
        <button className="btn btn-ghost" onClick={onReset} id="new-reading-btn">
          + New Reading
        </button>
      </header>

      <div className="results-container">
        {/* Title */}
        <div className="results-intro">
          <h1 className="results-title">Your Palm Reading</h1>
          <p className="results-subtitle">
            Our AI analyzed <strong>{metrics.line_count}</strong> line segments
            and detected <strong>{metrics.long_lines}</strong> primary palm lines.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="results-layout">
          {/* Left: Edge image */}
          <div className={`results-image-wrap glass ${showImage ? 'results-image-wrap--visible' : ''}`}>
            <div className="results-image-label">
              <span className="results-image-dot" />
              Edge Detection Analysis
            </div>
            <img
              src={`data:image/jpeg;base64,${edge_image}`}
              alt="Processed palm with detected lines highlighted"
              className="results-image"
            />
            <div className="results-image-legend">
              <span className="legend-item legend-item--gold">— Palm lines</span>
              <span className="legend-item legend-item--dim">— Skin texture</span>
            </div>
          </div>

          {/* Right: Prediction cards */}
          <div className="results-cards">
            {Object.entries(predictions).map(([type, data], i) => (
              type !== 'summary' && (
                <PredictionCard
                  key={type}
                  type={type}
                  data={data}
                  delay={400 + i * 200}
                />
              )
            ))}
          </div>
        </div>

        {/* Metrics strip */}
        <div className="metrics-strip glass">
          <div className="metric">
            <span className="metric__value">{metrics.line_count}</span>
            <span className="metric__label">Total Segments</span>
          </div>
          <div className="metric-divider" />
          <div className="metric">
            <span className="metric__value">{metrics.long_lines}</span>
            <span className="metric__label">Major Lines</span>
          </div>
          <div className="metric-divider" />
          <div className="metric">
            <span className="metric__value">{(metrics.edge_density * 100).toFixed(1)}%</span>
            <span className="metric__label">Line Density</span>
          </div>
          <div className="metric-divider" />
          <div className="metric">
            <span className="metric__value">3</span>
            <span className="metric__label">Zones Analyzed</span>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="results-disclaimer">
          ⚠️ This reading is generated for entertainment purposes using computer vision &amp; rule-based AI.
          Predictions are not scientifically accurate and do not constitute real palmistry or life advice.
        </p>

        <button className="btn btn-primary results-reset" onClick={onReset} id="read-again-btn">
          ✦ Read Another Palm
        </button>
      </div>
    </section>
  )
}
