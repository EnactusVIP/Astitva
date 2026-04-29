export default function ReadMore() {
  return (
    <section className="section two-col reverse" id="read-more">
      <div className="polaroid left">
        <div
          className="polaroid-img"
          style={{ backgroundImage: 'url(/assets/readmore-image.png)' }}
          role="img"
          aria-label="Aerial view of rainbow pride march"
        />
      </div>
      <div className="content">
        <h2>Read more</h2>
        <div className="outlined">
          <p>
            We are trying to build more than just a support platform. Going forward, the app
            will also include skill development courses to help you grow both personally and
            professionally.
          </p>
          <p>
            We also plan to add job listings that connect you with inclusive workplaces where
            you do not feel the need to hide who you are.
          </p>
          <p>
            If you would like to stay updated as we roll these out, you can sign up for our
            newsletter. We will share occasional updates, new features, and resources.
          </p>
          <p>
            At the end of the day, it is about supporting not just your well-being, but also
            your independence and growth.
          </p>
        </div>
      </div>
    </section>
  )
}
