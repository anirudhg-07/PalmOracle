import { useState, useRef, useCallback } from 'react'
import './UploadSection.css'

export default function UploadSection({ onUpload, onBack, loading, error }) {
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    const url = URL.createObjectURL(f)
    setPreview(url)
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => setDragging(false), [])

  const handleChange = (e) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  const handleSubmit = () => {
    if (file) onUpload(file)
  }

  return (
    <section className="upload-page">
      {/* Header */}
      <header className="upload-header">
        <button className="btn btn-ghost back-btn" onClick={onBack} id="back-btn">
          ← Back
        </button>
        <div className="upload-header__brand">
          <span className="gradient-text">✦ PalmOracle</span>
        </div>
      </header>

      <div className="upload-container">
        <div className="upload-intro">
          <h1 className="upload-title">
            Hold Your Palm to the Camera
          </h1>
          <p className="upload-subtitle">
            Upload a clear photo of your open palm under good lighting
            for the most accurate reading.
          </p>
        </div>

        {/* Tips */}
        <div className="upload-tips">
          <div className="tip">💡 Good lighting</div>
          <div className="tip">🖐 Flat, open hand</div>
          <div className="tip">📸 Focused, close-up</div>
        </div>

        {/* Drop Zone */}
        <div
          className={`dropzone glass ${dragging ? 'dropzone--dragging' : ''} ${preview ? 'dropzone--has-preview' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !preview && inputRef.current?.click()}
          id="drop-zone"
        >
          {preview ? (
            <div className="dropzone__preview-wrap">
              <img src={preview} alt="Palm preview" className="dropzone__preview" />
              <button
                className="dropzone__change-btn"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
              >
                Change Image
              </button>
            </div>
          ) : (
            <div className="dropzone__placeholder">
              <div className="dropzone__icon">🖐</div>
              <p className="dropzone__text">Drag & drop your palm photo here</p>
              <p className="dropzone__subtext">or click to browse</p>
              <p className="dropzone__formats">JPG, PNG, WEBP supported</p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="dropzone__input"
            onChange={handleChange}
            id="file-input"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="upload-error">
            ⚠️ {error}
          </div>
        )}

        {/* Submit */}
        <button
          className="btn btn-primary upload-submit"
          onClick={handleSubmit}
          disabled={!file || loading}
          id="analyze-btn"
        >
          {loading ? (
            <>
              <span className="spinner" />
              Analyzing your palm lines…
            </>
          ) : (
            <>✦ Reveal My Destiny</>
          )}
        </button>

        {/* Loading overlay */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-card glass-strong">
              <div className="loading-orb" />
              <div className="loading-text">
                <h3>Reading your palm…</h3>
                <p>Detecting lines & calculating your destiny</p>
              </div>
              <div className="loading-steps">
                <div className="loading-step active">✓ Converting to grayscale</div>
                <div className="loading-step active">✓ Detecting edges</div>
                <div className="loading-step">→ Analyzing line patterns</div>
                <div className="loading-step">→ Generating predictions</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
