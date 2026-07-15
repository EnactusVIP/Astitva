import { useState } from 'react'

const TOPICS = [
  { label: 'Coming Out', color: 'pink' },
  { label: 'Family & Relationships', color: 'orange' },
  { label: 'Mental Health', color: 'yellow' },
  { label: 'Identity & Expression', color: 'green' },
  { label: 'Workplace/School', color: 'blue' },
  { label: 'Housing & Safety', color: 'pink' },
  { label: 'Healthcare Access', color: 'orange' },
  { label: 'Grief & Loss', color: 'yellow' },
  { label: 'Others', color: 'blue' },
]

export default function AnonymousTab() {
  const [topic, setTopic] = useState(null)
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/anonymous', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, message }),
      })
      if (!res.ok) throw new Error('Request failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="anon-tab">
      <span className="anon-badge">🔒 100% Anonymous — No account required</span>

      <h2 className="newsletter-heading">
        Share your story, <em>safely</em>
      </h2>

      <p className="anon-subtext">
        This space is just for you. Share experiences, ask questions, or
        simply let it out, completely anonymously and without judgment.
      </p>

      {!submitted ? (
        <form className="anon-form" onSubmit={handleSubmit}>
          <div className="anon-field">
            <span className="anon-field-label">Topic</span>
            <div className="anon-topics-grid">
              {TOPICS.map(t => (
                <button
                  type="button"
                  key={t.label}
                  className={`anon-topic-pill anon-topic-pill--${t.color}${topic === t.label ? ' anon-topic-pill--active' : ''}`}
                  onClick={() => setTopic(t.label)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <label className="anon-field">
            <span className="anon-field-label">Your message</span>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Whatever you feel comfortable sharing. This is your space…"
              rows={7}
              required
            />
          </label>

          {error && <p className="modal-error">{error}</p>}

          <button type="submit" className="anon-submit-btn" disabled={submitting}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            {submitting ? 'Submitting…' : 'Submit Anonymously'}
          </button>
        </form>
      ) : (
        <div className="newsletter-thanks">
          <div className="hub-stars" aria-hidden="true" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
            <span className="hub-star star-pink">✦</span>
            <span className="hub-star star-orange">✦</span>
            <span className="hub-star star-yellow">✦</span>
          </div>
          <p className="newsletter-success">Your submission has been received. Thank you for sharing.</p>
        </div>
      )}

      <div className="counsel-notice">
        <p>
          All submissions are 100% anonymous. We do not collect any identifying
          information. Your privacy is our priority.
        </p>
      </div>
    </div>
  )
}
