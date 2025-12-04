import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <nav id="main-nav">
            <div className="nav-logo" onClick={() => navigate('/')}>
                <i className="fa-solid fa-wallet"></i> <span className="text-gradient">GesFinApp</span>
            </div>

            <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
                <i className={`fa-solid ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>

            <div className={`nav-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>

            {user ? (
                // Private Links (Dashboard)
                <ul className={`nav-links private-nav ${isMenuOpen ? 'active' : ''}`}>
                    <li>
                        <Link to="/dashboard" className={isActive('/dashboard')} onClick={closeMenu}>
                            <i className="fa-solid fa-chart-pie"></i> Resumen
                        </Link>
                    </li>
                    <li>
                        <Link to="/transactions" className={isActive('/transactions')} onClick={closeMenu}>
                            <i className="fa-solid fa-list"></i> Movimientos
                        </Link>
                    </li>
                    <li>
                        <Link to="/goals" className={isActive('/goals')} onClick={closeMenu}>
                            <i className="fa-solid fa-bullseye"></i> Metas
                        </Link>
                    </li>
                    <li>
                        <Link to="/education" className={isActive('/education')} onClick={closeMenu}>
                            <i className="fa-solid fa-graduation-cap"></i> Educación
                        </Link>
                    </li>
                    {/* Mobile Only Logout */}
                    <li className="mobile-only">
                        <button onClick={handleLogout} className="nav-logout-mobile">
                            <i className="fa-solid fa-right-from-bracket"></i> Cerrar Sesión
                        </button>
                    </li>
                </ul>
            ) : (
                // Public Links (Landing)
                <div className={`nav-links public-nav ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/login" onClick={closeMenu}>
                        <button className="btn-secondary small">Iniciar Sesión</button>
                    </Link>
                    <Link to="/register" onClick={closeMenu}>
                        <button className="btn-primary small">Registrarse</button>
                    </Link>
                </div>
            )}

            {user && (
                <div className="nav-user private-nav desktop-only">
                    <span id="user-name-display">{user.name}</span>
                    <button id="logout-btn" onClick={handleLogout} title="Cerrar Sesión">
                        <i className="fa-solid fa-right-from-bracket"></i>
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
