import React from 'react'

const ModelCard = ({ title, description, href }) => (
  <a href={`#${href}`} className="model-card">
    <div className="eyebrow">Model</div>
    <h3>{title}</h3>
    <p>{description}</p>
    <div className="cta">Open →</div>
  </a>
)

const HomePage = () => {
  return (
    <div className="page-shell">
      <section className="panel">
        <div className="kicker">Homeless policy toolkit</div>
        <h1 className="page-title">Helpful concepts and tools for thinking about homeless policy</h1>
        <p className="page-subtitle">
          Start with the overview video, then explore interactive models that show how system design affects people,
          budgets, and tradeoffs. Each model has a dedicated link you can share.
        </p>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Watch the overview</h2>
          <span className="helper">The video is the primary starting point.</span>
        </div>
        <div className="video-container">
          <iframe
            className="video"
            src="https://www.youtube.com/embed/yachetMaSwE?si=tbtIUSTAjGVI5CIl"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Explore the interactive models</h2>
          <span className="helper">Click a card to open a model-only view</span>
        </div>
        <div className="model-grid">
          <ModelCard
            title="Permanent Supportive Housing model"
            description="Simulate occupancy, budgets, and availability under different inflow, stay lengths, and growth rates."
            href="/models/housing"
          />
          <ModelCard
            title="Public health allocation tradeoffs"
            description="See the breadth vs depth tradeoff while adjusting tax rates, revenue, and impact in a scarcity setting."
            href="/models/tradeoffs"
          />
        </div>
      </section>
    </div>
  )
}

export default HomePage
