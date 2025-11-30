import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <nav id="main-nav">
            <div className="nav-logo" onClick={() => navigate('/')}>
                <i className="fa-solid fa-wallet"></i> <span className="text-gradient">GesFinApp</span>
            </div>

            {user ? (
                // Private Links (Dashboard)
                <ul className="nav-links private-nav">
                    <li>
                        <Link to="/dashboard" className={isActive('/dashboard')}>
                            <i className="fa-solid fa-chart-pie"></i> Resumen
                        </Link>
                    </li>
                    <li>
                        <Link to="/transactions" className={isActive('/transactions')}>
                            <i className="fa-solid fa-list"></i> Movimientos
                        </Link>
                    </li>
                    <li>
                        <Link to="/goals" className={isActive('/goals')}>
                            <i className="fa-solid fa-bullseye"></i> Metas
                        </Link>
                    </li>
                    <li>
                        <Link to="/education" className={isActive('/education')}>
                            <i className="fa-solid fa-graduation-cap"></i> Educación
                        </Link>
                    </li>
                </ul>
            ) : (
                // Public Links (Landing) - Hidden on mobile usually, but we keep it simple
                <div className="nav-links public-nav">
                    <Link to="/login">
                        <button className="btn-secondary small">Iniciar Sesión</button>
                    </Link>
                    <Link to="/register">
                        <button className="btn-primary small">Registrarse</button>
                    </Link>
                </div>
            )}

            {user && (
                <div className="nav-user private-nav">
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
