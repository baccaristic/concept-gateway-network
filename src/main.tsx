
// Polyfill for global which is needed by sockjs-client
window.global = window;

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
