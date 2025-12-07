import logoFooter from '../assets/logo-footer.png';

const Footer = () => {
    return (
        <footer style={{
            marginTop: 'var(--spacing-lg)',
            padding: 'var(--spacing-md) 0',
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
            fontSize: '0.875rem'
        }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <img src={logoFooter} alt="Logo Creamos Juntos" style={{ height: '52px', opacity: 0.8 }} />
                <div>
                    <p>Estamos levantando los cimientos</p>
                    <p style={{ marginTop: '0.5rem', opacity: 0.7, fontSize: '0.8rem' }}>&copy; {new Date().getFullYear()} Creamos juntos</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
