import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <section id="view-landing" className="view active">
            <div className="hero-section animate-fade-in">
                <h1 className="animate-slide-up">Domina tus <span className="text-gradient">Finanzas Personales</span></h1>
                <p className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    GesFinApp te ayuda a controlar tus gastos, ahorrar para tus metas y aprender sobre educación
                    financiera de manera simple, visual y elegante.
                </p>
                <div className="hero-buttons animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <Link to="/register">
                        <button className="btn-primary">Comenzar Ahora</button>
                    </Link>
                    <Link to="/login">
                        <button className="btn-secondary">Ya tengo cuenta</button>
                    </Link>
                </div>
            </div>

            <div className="features-grid animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <div className="feature-card glass-panel">
                    <i className="fa-solid fa-chart-pie"></i>
                    <h3>Visualiza tu Dinero</h3>
                    <p>Gráficos intuitivos para entender a dónde va tu dinero cada mes.</p>
                </div>
                <div className="feature-card glass-panel">
                    <i className="fa-solid fa-bullseye"></i>
                    <h3>Cumple tus Metas</h3>
                    <p>Define objetivos de ahorro y sigue tu progreso en tiempo real.</p>
                </div>
                <div className="feature-card glass-panel">
                    <i className="fa-solid fa-graduation-cap"></i>
                    <h3>Aprende Finanzas</h3>
                    <p>Consejos prácticos para mejorar tu salud financiera.</p>
                </div>
            </div>
        </section>
    );
};

export default Landing;
