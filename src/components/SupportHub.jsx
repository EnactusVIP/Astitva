import { useState } from 'react'
import CounsellingTab from './CounsellingTab'
import NewsletterTab from './NewsletterTab'
import AnonymousTab from './AnonymousTab'

const TABS = [
  { id: 'counselling', label: 'Counselling' },
  { id: 'newsletter', label: 'Newsletter & Resources' },
  { id: 'anonymous', label: 'Anonymous Submissions' },
]

export default function SupportHub({ onBack }) {
  const [activeTab, setActiveTab] = useState('counselling')

  return (
    <div className="hub-page">
      {/* ── Rainbow stripe top ── */}
      <div className="hub-stripe" />

      {/* ── Hub card ── */}
      <div className="hub-card">
        <button className="back-btn hub-back" onClick={onBack}>
          ← Back to home
        </button>

        {/* Decorative stars */}
        <div className="hub-stars" aria-hidden="true">
          <span className="hub-star star-pink">✦</span>
          <span className="hub-star star-orange">✦</span>
          <span className="hub-star star-yellow">✦</span>
          <span className="hub-star star-green">✦</span>
        </div>

        {/* Heading */}
        <h1 className="hub-heading">
          You Belong Here, <em>Always</em>
        </h1>

        {/* Tab buttons */}
        <div className="hub-tabs" role="tablist">
          {TABS.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`hub-tab${activeTab === tab.id ? ' hub-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Rainbow stripe mid ── */}
      <div className="hub-stripe" />

      {/* ── Tab content panel ── */}
      <div className="hub-panel" role="tabpanel">
        <div className="hub-panel-inner">
          {activeTab === 'counselling' && <CounsellingTab />}
          {activeTab === 'newsletter' && <NewsletterTab />}
          {activeTab === 'anonymous' && <AnonymousTab />}
        </div>
      </div>

      {/* ── Rainbow stripe bottom ── */}
      <div className="hub-stripe" />
    </div>
  )
}
