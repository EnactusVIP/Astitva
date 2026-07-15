import { useState } from 'react'
import BookingModal from './BookingModal'

export default function CounsellingTab() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="counsel-tab">
      {/* ── Colourful heading ── */}
      <h2 className="counsel-heading" aria-label="A place to heal and be yourself">
        <span className="ch ch-a1">A </span>
        <span className="ch ch-p">p</span>
        <span className="ch ch-l">l</span>
        <span className="ch ch-a2">a</span>
        <span className="ch ch-c">c</span>
        <span className="ch ch-e1">e </span>
        <span className="ch ch-t">t</span>
        <span className="ch ch-o">o </span>
        <span className="ch ch-h">h</span>
        <span className="ch ch-e2">e</span>
        <span className="ch ch-a3">a</span>
        <span className="ch ch-l2">l </span>
        <span className="ch ch-amp">&amp; </span>
        <span className="ch ch-b">b</span>
        <span className="ch ch-e3">e </span>
        <span className="ch ch-y">y</span>
        <span className="ch ch-o2">o</span>
        <span className="ch ch-u">u</span>
        <span className="ch ch-r">r</span>
        <span className="ch ch-s">s</span>
        <span className="ch ch-e4">e</span>
        <span className="ch ch-l3">l</span>
        <span className="ch ch-f">f</span>
      </h2>

      {/* ── Description banner ── */}
      <div className="counsel-desc">
        <p>
          Our counsellors are trained in LGBTQIA+ affirming care and are here
          to support your mental health — whatever chapter you are in.
        </p>
      </div>

      {/* ── Individual Therapy label ── */}
      <div className="counsel-therapy-label">
        Individual Therapy
      </div>

      {/* ── Two option cards ── */}
      <div className="counsel-options">
        <div className="counsel-option-card">
          <span className="counsel-option-title">one-on-one session</span>
          <p>with the LGBTQIA+ affirming therapist</p>
        </div>
        <div className="counsel-option-card">
          <span className="counsel-option-title">one-on-one chat</span>
          <p>with the LGBTQIA+ affirming therapist</p>
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="counsel-actions">
        <button className="counsel-btn counsel-btn--book" onClick={() => setModalOpen(true)}>
          Book a free consultation
        </button>
        <a href="#counsellors" className="counsel-btn counsel-btn--meet">
          Meet our counsellors
        </a>
      </div>

      {modalOpen && <BookingModal onClose={() => setModalOpen(false)} />}

      {/* ── Confidentiality notice ── */}
      <div className="counsel-notice">
        <p>
          All sessions are strictly confidential. We follow ethical counselling
          standards and will never share your information without your explicit
          consent.
        </p>
      </div>
    </div>
  )
}
