import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Global interceptor to rewrite localhost:5000 API requests when deployed to Vercel/production
axios.interceptors.request.use((config) => {
  const apiBase = import.meta.env.VITE_API_BASE_URL;
  if (apiBase && config.url && config.url.startsWith('http://localhost:5000')) {
    config.url = config.url.replace('http://localhost:5000', apiBase);
  }
  return config;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
