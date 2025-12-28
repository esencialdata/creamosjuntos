import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Backstage from './pages/Backstage'

createRoot(document.getElementById('root-service')).render(
    <StrictMode>
        <Backstage />
    </StrictMode>,
)
