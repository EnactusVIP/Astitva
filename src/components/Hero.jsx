export default function Hero({ onJoin, onSupport }) {
  return (
    <section className="hero" id="home">
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1>
          <span>Project</span> <em>Astitva</em>
        </h1>
        <p>
          Exist as <em>you</em> are.
        </p>
        <div className="hero-buttons">
          <button className="join-btn" onClick={onJoin}>
            Join Community
          </button>
          <button className="join-btn support-btn" onClick={onSupport}>
            Support &amp; Resources
          </button>
        </div>
      </div>
    </section>
  )
}
