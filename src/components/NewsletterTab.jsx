import { useState } from 'react'

const ARTICLES = [
  'Coming Out',
  'Helpful Tips',
  'Coming Out to Family',
  'Will they accept me?',
  'Coming Out to Friends',
]

const FILTERS = [
  { id: 'all', label: 'All', color: 'pink' },
  { id: 'article', label: 'Article', color: 'orange' },
  { id: 'news', label: 'News Updates', color: 'blue' },
]

export default function NewsletterTab() {
  const [email, setEmail] = useState('')
  const [filter, setFilter] = useState('all')

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div className="newsletter-tab">
      <div className="newsletter-banner">
        <div className="newsletter-banner-text">
          <span className="newsletter-banner-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" />
            </svg>
            Monthly Newsletters
          </span>
          <h2 className="newsletter-banner-heading">Stay updated and connected</h2>
        </div>

        <form className="newsletter-banner-form" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@gmail.com"
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>

      <div className="newsletter-filters">
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={`newsletter-filter newsletter-filter--${f.color}${filter === f.id ? ' newsletter-filter--active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {(filter === 'all' || filter === 'article') && (
        <div className={`newsletter-content-card newsletter-content-card--${filter === 'all' ? 'pink' : 'orange'}`}>
          {filter === 'all' && (
            <span className="newsletter-content-label">Article</span>
          )}
          <div className="newsletter-item-grid">
            {ARTICLES.map(title => (
              <span key={title} className="newsletter-item-pill">{title}</span>
            ))}
            {filter === 'all' && (
              <span className="newsletter-item-pill">Newsletters</span>
            )}
          </div>
        </div>
      )}

      {(filter === 'all' || filter === 'news') && (
        <div className="newsletter-content-card newsletter-content-card--blue">
          {filter === 'all' && (
            <span className="newsletter-content-label newsletter-content-label--blue">News Updates</span>
          )}
          <span className="newsletter-item-pill newsletter-item-pill--wide">
            Click here to read latest newsletters/updates
          </span>
        </div>
      )}
    </div>
  )
}
