import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (register(name, email, password)) {
            navigate('/dashboard');
        }
    };

    return (
        <section id="view-register" className="view">
            <div className="auth-container">
                <div className="auth-box glass-panel">
                    <h1>Crear Cuenta</h1>
                    <p>Empieza tu viaje hacia la libertad financiera.</p>
                    <form id="register-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <i className="fa-solid fa-user"></i>
                            <input
                                type="text"
                                id="register-name"
                                placeholder="Nombre completo"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <i className="fa-solid fa-envelope"></i>
                            <input
                                type="email"
                                id="register-email"
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
                                id="register-password"
                                placeholder="Contraseña"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="auth-buttons">
                            <button type="submit" className="btn-primary">Registrarse</button>
                            <Link to="/login">
                                <button type="button" className="btn-secondary" id="go-to-login">Ya tengo cuenta</button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Register;
