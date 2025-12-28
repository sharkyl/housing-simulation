import React, { useEffect, useMemo, useState } from 'react'
import HousingSimulation from './components/HousingSimulation'
import HomePage from './components/HomePage'
import TradeoffsModel from './components/TradeoffsModel'
import Navigation from './components/Navigation'

const ROUTES = {
  '/': 'home',
  '/models/housing': 'housing',
  '/models/tradeoffs': 'tradeoffs',
}

const readHashPath = () => {
  const hash = window.location.hash || '#/'
  const path = hash.replace('#', '') || '/'
  return ROUTES[path] ? path : '/'
}

function App() {
  const [currentRoute, setCurrentRoute] = useState(readHashPath())

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = '#/'
    }
    const handleHashChange = () => {
      setCurrentRoute(readHashPath())
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = (path) => {
    if (!ROUTES[path]) return
    window.location.hash = path
    setCurrentRoute(path)
  }

  const content = useMemo(() => {
    switch (currentRoute) {
      case '/models/housing':
        return <HousingSimulation />
      case '/models/tradeoffs':
        return <TradeoffsModel />
      default:
        return <HomePage />
    }
  }, [currentRoute])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation currentRoute={currentRoute} onNavigate={navigate} />
      {content}
    </div>
  )
}

export default App
