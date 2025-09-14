import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const NavLink = ({ to, children }) => {
  const loc = useLocation()
  const active = loc.pathname === to
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition
        ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
    >
      {children}
    </Link>
  )
}

export default function App({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">₹</div>
            <h1 className="text-xl font-semibold text-gray-900">Expense Tracker</h1>
          </div>
          <nav className="flex items-center gap-2">
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/expenses">Expenses</NavLink>
            <NavLink to="/import">Import CSV</NavLink>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>

      <footer className="mt-8 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Expense Tracker
      </footer>
    </div>
  )
}
