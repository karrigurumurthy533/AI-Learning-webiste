import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css';
import { AuthProvider } from './context/authContext.jsx';
import {Toaster} from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Toaster position='top-right' toastOptions={{duration:3000}}/>
      <BrowserRouter>
        <App />
      </BrowserRouter>

    </AuthProvider>

  </StrictMode>,
)