import React from 'react';

const AboutUs = () => {
    return (
        <div className="page-container animate-fade-in">
            <div className="hero-section text-center mb-5">
                <h1 className="text-gradient mb-4">Sobre Nosotros</h1>
                <p className="lead text-muted" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    En GesFinApp, creemos que el control financiero es la clave para la libertad personal.
                    Nuestra misión es empoderar a las personas con herramientas intuitivas y poderosas para gestionar su dinero.
                </p>
            </div>

            <div className="features-grid mb-5">
                <div className="glass-panel feature-card">
                    <i className="fas fa-bullseye mb-3"></i>
                    <h3>Nuestra Misión</h3>
                    <p>Facilitar la gestión financiera personal a través de tecnología accesible y diseño centrado en el usuario.</p>
                </div>
                <div className="glass-panel feature-card">
                    <i className="fas fa-eye mb-3"></i>
                    <h3>Nuestra Visión</h3>
                    <p>Ser la aplicación líder en educación y gestión financiera en Latinoamérica.</p>
                </div>
                <div className="glass-panel feature-card">
                    <i className="fas fa-heart mb-3"></i>
                    <h3>Nuestros Valores</h3>
                    <p>Transparencia, seguridad y simplicidad son los pilares de todo lo que construimos.</p>
                </div>
            </div>

            <div className="glass-panel p-5 mb-5 text-center">
                <h2 className="mb-4">¿Por qué GesFinApp?</h2>
                <p className="text-muted mb-4">
                    Nacimos de la necesidad de tener una herramienta que no solo registre gastos,
                    sino que también eduque y ayude a cumplir metas reales.
                </p>
            </div>
        </div>
    );
};

export default AboutUs;
