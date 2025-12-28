import React from 'react'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/models/housing', label: 'Housing model' },
  { path: '/models/tradeoffs', label: 'Public health tradeoffs' },
]

const Navigation = ({ currentRoute, onNavigate }) => {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="text-lg font-semibold text-gray-800">Housing-sim.com</div>
        <nav className="flex items-center gap-4 text-sm font-medium text-gray-700">
          {navItems.map((item) => {
            const isActive = currentRoute === item.path
            return (
              <a
                key={item.path}
                href={`#${item.path}`}
                onClick={() => onNavigate(item.path)}
                className={`${
                  isActive ? 'text-blue-700' : 'text-gray-700'
                } rounded-md px-2 py-1 transition hover:bg-gray-100`}
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
