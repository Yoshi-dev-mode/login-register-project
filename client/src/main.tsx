import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "./context/AuthProvider.tsx";
import './index.css'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>,
)
