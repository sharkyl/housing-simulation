import React from 'react'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/models/housing', label: 'Housing model' },
  { path: '/models/tradeoffs', label: 'Public health tradeoffs' },
]

const Navigation = ({ currentRoute, onNavigate }) => {
  return (
    <header className="app-nav">
      <div className="app-nav-inner">
        <div className="nav-brand">Homeless Policy Concepts</div>
        <nav className="nav-links">
          {navItems.map((item) => {
            const isActive = currentRoute === item.path
            return (
              <a
                key={item.path}
                href={`#${item.path}`}
                onClick={() => onNavigate(item.path)}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </a>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

export default Navigation
