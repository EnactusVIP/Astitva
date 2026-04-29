import { useState } from 'react'

export default function JoinCommunity({ onBack }) {
  const [form, setForm] = useState({ name: '', phone: '', city: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(onBack, 3500)
  }

  if (submitted) {
    return (
      <div className="join-page">
        <div className="join-card thank-you">
          <div className="stars-row">
            <span className="star pink">✦</span>
            <span className="star orange">✦</span>
            <span className="star yellow">✦</span>
            <span className="star green">✦</span>
            <span className="star blue">✦</span>
          </div>
          <h2>Thank You!</h2>
          <p className="join-sub">
            Thank you for your response.<br />We will contact you soon.
          </p>
          <p className="redirect-note">Redirecting you home…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="join-page">
      <div className="join-card">
        <button className="back-btn" onClick={onBack}>
          ← Back to home
        </button>

        <h2>Join Our Community</h2>
        <p className="join-sub">Be part of a space that truly sees you.</p>

        <form className="join-form" onSubmit={handleSubmit}>
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
            City
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Enter your city"
              required
            />
          </label>

          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  )
}
