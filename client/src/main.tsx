import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {StrictMode} from "react";
import {BrowserRouter} from "react-router-dom";
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <div className="min-h-screen w-full bg-[var(--bg-dark)] text-white">
                <App />
            </div>
        </BrowserRouter>
    </StrictMode>
)
