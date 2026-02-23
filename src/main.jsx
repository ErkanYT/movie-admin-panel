import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

// Set base URL for production (Vercel) or development (Vite Proxy)
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
axios.defaults.headers.common['x-api-key'] = import.meta.env.VITE_API_KEY || 'nova_secret_key_2026';
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
