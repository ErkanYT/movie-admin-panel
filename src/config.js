// Configuration helper
// In Vercel, set VITE_API_URL to your Render Backend URL (e.g. https://nova-stream-backend.onrender.com)
// Locally, it defaults to http://localhost:3000

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

if (!import.meta.env.VITE_API_URL) {
    console.warn('VITE_API_URL is not set. Using localhost:3000');
}
