export default function Hero({ onJoin }) {
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
        </div>
      </div>
    </section>
  )
}
