import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Backstage from './pages/Backstage'
import PWAInstallBanner from './components/PWAInstallBanner'

createRoot(document.getElementById('root-service')).render(
    <StrictMode>
        <PWAInstallBanner />
        <Backstage />
    </StrictMode>,
)
