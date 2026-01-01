import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Backstage from './pages/Backstage'
import PWAInstallBanner from './components/PWAInstallBanner'
import { initializeDefaultData } from './services/firestoreService'

const ServiceApp = () => {
    useEffect(() => {
        initializeDefaultData();
    }, []);

    return (
        <StrictMode>
            <PWAInstallBanner />
            <Backstage />
        </StrictMode>
    );
};

createRoot(document.getElementById('root-service')).render(<ServiceApp />)
