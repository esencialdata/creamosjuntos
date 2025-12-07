import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main className="container" style={{ flex: 1 }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
