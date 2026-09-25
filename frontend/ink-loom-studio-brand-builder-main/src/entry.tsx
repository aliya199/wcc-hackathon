import React from 'react'
import { createRoot } from 'react-dom/client'
import { Route as AppRoute } from './routes/index'
import './styles.css'
import { BrandStudio } from './components/brand-studio'

function App() {
  return <BrandStudio />
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
