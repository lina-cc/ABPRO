import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-logo">
                    <i className="fas fa-wallet"></i>
                    <span>GesFinApp</span>
                </div>
                <div className="footer-links">
                    <Link to="/about" className="footer-link">Sobre Nosotros</Link>
                    <a href="#" className="footer-link">Política de Privacidad</a>
                    <a href="#" className="footer-link">Términos de Servicio</a>
                </div>
                <div className="social-links">
                    <a href="https://www.instagram.com/gesfinapp" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <i className="fab fa-instagram"></i>
                    </a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} GesFinApp. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;
