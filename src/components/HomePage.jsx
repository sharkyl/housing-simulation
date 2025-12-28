import React from 'react'

const ModelCard = ({ title, description, href }) => (
  <a
    href={`#${href}`}
    className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
  >
    <div className="text-sm font-semibold text-blue-700">Model</div>
    <h3 className="mt-1 text-lg font-semibold text-gray-900">{title}</h3>
    <p className="mt-2 text-sm text-gray-600">{description}</p>
    <div className="mt-3 text-sm font-medium text-blue-700">Open →</div>
  </a>
)

const HomePage = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-6">
      <section className="grid gap-8 lg:grid-cols-[2fr,1fr] lg:items-start">
        <div>
          <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            Homeless policy toolkit
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Helpful concepts and tools for thinking about homeless policy
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-700">
            Start with the overview video, then explore interactive models that show how system design
            affects people, budgets, and tradeoffs. Each model has a dedicated link you can share.
          </p>
        </div>
        <div className="rounded-2xl bg-blue-50 p-4 text-sm text-blue-900">
          <div className="font-semibold text-blue-800">What’s inside</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Permanent supportive housing pipeline simulation</li>
            <li>Public health allocation tradeoffs explorer</li>
            <li>More policy visualizations coming soon</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900">Watch the overview</h2>
        <p className="mt-2 text-sm text-gray-700">
          The video is the primary starting point. It explains the policy questions this site explores.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl shadow-lg">
          <div className="video-container">
            <iframe
              className="video"
              src="https://www.youtube.com/embed/yachetMaSwE?si=tbtIUSTAjGVI5CIl"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Explore the interactive models</h2>
          <p className="text-xs text-gray-600">Click a card to open a model-only page</p>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ModelCard
            title="Permanent Supportive Housing model"
            description={
              'Simulate occupancy, budgets, and availability under different inflow, stay lengths, and growth rates.'
            }
            href="/models/housing"
          />
          <ModelCard
            title="Public health allocation tradeoffs"
            description={
              'See the breadth vs depth tradeoff while adjusting tax rates, revenue, and impact '
              + 'in a scarcity setting.'
            }
            href="/models/tradeoffs"
          />
        </div>
      </section>
    </div>
  )
}

export default HomePage
