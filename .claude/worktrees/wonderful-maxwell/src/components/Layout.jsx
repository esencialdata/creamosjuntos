import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useGlobalPlayer } from '../context/GlobalPlayerContext';

const Layout = ({ children }) => {
    const { isVisible } = useGlobalPlayer();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main className="container" style={{
                flex: 1,
                paddingBottom: isVisible ? 'calc(80px + var(--bottom-nav-height, 0px))' : 'var(--spacing-md)'
            }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
