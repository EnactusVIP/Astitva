export default function About() {
  return (
    <section className="section two-col" id="about">
      <div className="content">
        <h2>About Us</h2>
        <p>
          Our platform is designed for LGBTQIA+ individuals seeking support, clarity, or simply a
          place to be heard without judgment. We aim to create an ecosystem that meets you where
          you are.
        </p>
        <p>
          A thoughtfully designed AI chatbot is always there to offer private support. Whether
          you are navigating questions about identity, relationships, mental health, or coming
          out, the chatbot is here to listen and guide.
        </p>
        <p>
          We also recognize that human conversations are irreplaceable, which is why we offer
          one-on-one therapy sessions with trained professionals who understand you, regardless of
          where you are in your journey.
        </p>
        <p>
          This is a space for you to be yourself. We are here with support, respect, privacy, and
          understanding whenever you need it.
        </p>
      </div>

      <div className="polaroid-wrap">
        <div className="polaroid-bg" />
        <div className="polaroid right">
          <div
            className="polaroid-img"
            style={{ backgroundImage: 'url(/assets/about-image.png)' }}
            role="img"
            aria-label="Pride parade car celebration"
          />
        </div>
        <div className="about-deco" aria-hidden="true">
          <span className="arc arc-1" />
          <span className="arc arc-2" />
          <span className="arc arc-3" />
        </div>
      </div>
    </section>
  )
}
