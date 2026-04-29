import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          Project <em>Astitva</em>
        </div>

        <button
          className={`nav-toggle${open ? ' open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar-links${open ? ' open' : ''}`}>
          <a href="#home"     onClick={close}>Home</a>
          <a href="#about"    onClick={close}>About Us</a>
          <a href="#read-more" onClick={close}>Read More</a>
          <a href="#contact"  onClick={close}>Contact Us</a>
        </nav>
      </div>
    </header>
  )
}
