import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Expenses from './pages/Expenses.jsx'
import ImportPage from './pages/Import.jsx'
import './index.css'
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/expenses" element={<Expenses/>} />
          <Route path="/import" element={<ImportPage/>} />
        </Routes>
      </App>
    </BrowserRouter>
  </React.StrictMode>
)
