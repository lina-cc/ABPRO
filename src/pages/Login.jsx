import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            navigate('/dashboard');
        }
    };

    const handleGoogleLogin = async () => {
        const success = await loginWithGoogle();
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <section id="view-login" className="view">
            <div className="auth-container">
                <div className="auth-box glass-panel animate-slide-up">
                    <h1>Bienvenido a <span className="text-gradient">GesFinApp</span></h1>
                    <p>Toma el control de tus finanzas hoy.</p>
                    <form id="login-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <i className="fa-solid fa-envelope"></i>
                            <input
                                type="email"
                                id="login-email"
                                placeholder="Correo electrónico"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <i className="fa-solid fa-lock"></i>
                            <input
                                type="password"
                                id="login-password"
                                placeholder="Contraseña"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="auth-buttons">
                            <button type="submit" className="btn-primary">Iniciar Sesión</button>
                            <Link to="/register">
                                <button type="button" className="btn-secondary" id="go-to-register">Crear Cuenta</button>
                            </Link>
                        </div>
                        <div className="auth-separator">
                            <span>O continúa con</span>
                        </div>
                        <button type="button" className="btn-google" onClick={handleGoogleLogin}>
                            <i className="fa-brands fa-google"></i> Google
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Login;
