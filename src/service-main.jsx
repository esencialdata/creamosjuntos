import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import Backstage from './pages/Backstage'
import SpiritualThermometer from './pages/SpiritualThermometer';
import PWAInstallBanner from './components/PWAInstallBanner'
import { initializeDefaultData } from './services/firestoreService'

const ServiceApp = () => {
    useEffect(() => {
        initializeDefaultData();
    }, []);

    return (
        <StrictMode>
            <PWAInstallBanner />
            <Router>
                <Routes>
                    <Route path="/" element={<Backstage />} />
                    <Route path="/termometro" element={<SpiritualThermometer />} />
                </Routes>
            </Router>
        </StrictMode>
    );
};

createRoot(document.getElementById('root-service')).render(<ServiceApp />)
