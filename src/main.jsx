import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

// Set base URL for production (Vercel) or development (Vite Proxy)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';
axios.defaults.headers.common['x-api-key'] = import.meta.env.VITE_API_KEY || 'sifreyebbulama57530hahahnsck292';

// Intercept 401 Unauthorized to handle expired JWT tokens automatically
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Session expired or unauthorized. Logging out...');
            localStorage.removeItem('token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
