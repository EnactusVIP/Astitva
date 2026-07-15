import { useState } from 'react'

export default function BookingModal({ onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', agenda: '' })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('/api/counselling-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        {status === 'success' ? (
          <div className="newsletter-thanks">
            <div className="hub-stars" aria-hidden="true" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
              <span className="hub-star star-pink">✦</span>
              <span className="hub-star star-orange">✦</span>
              <span className="hub-star star-yellow">✦</span>
            </div>
            <p className="newsletter-success">
              Thank you! We've received your request and will reach out soon.
            </p>
          </div>
        ) : (
          <>
            <h3 className="modal-heading">Book a free consultation</h3>
            <p className="modal-sub">
              Tell us a bit about yourself so we can match you with the right counsellor.
            </p>

            <form className="modal-form" onSubmit={handleSubmit}>
              <label>
                Your Name
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label>
                Phone Number
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </label>

              <label>
                Agenda for Counselling
                <textarea
                  name="agenda"
                  value={form.agenda}
                  onChange={handleChange}
                  placeholder="What would you like to talk about?"
                  rows={4}
                  required
                />
              </label>

              {status === 'error' && (
                <p className="modal-error">Something went wrong — please try again.</p>
              )}

              <button type="submit" className="counsel-btn counsel-btn--book" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Submitting…' : 'Request Consultation'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
