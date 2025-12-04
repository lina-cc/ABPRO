const Education = () => {
    const topics = [
        {
            icon: "fa-piggy-bank",
            title: "La Regla 50/30/20",
            content: "Una guía simple para tu presupuesto: destina el 50% de tus ingresos a necesidades básicas, el 30% a tus deseos y entretenimiento, y el 20% restante al ahorro e inversión.",
            color: "#10b981"
        },
        {
            icon: "fa-shield-halved",
            title: "Fondo de Emergencia",
            content: "Tu red de seguridad. Antes de invertir, asegúrate de tener ahorrado entre 3 a 6 meses de tus gastos básicos. Esto te protege de imprevistos sin endeudarte.",
            color: "#3b82f6"
        },
        {
            icon: "fa-chart-line",
            title: "Interés Compuesto",
            content: "Haz que tu dinero trabaje por ti. Es el efecto de ganar intereses sobre tus intereses anteriores. Cuanto antes empieces, mayor será el crecimiento exponencial.",
            color: "#8b5cf6"
        },
        {
            icon: "fa-scale-balanced",
            title: "Deuda Buena vs. Mala",
            content: "No toda deuda es igual. La deuda 'buena' (hipoteca, educación) puede aumentar tu patrimonio. La deuda 'mala' (tarjetas de crédito, consumo) drena tus recursos con altos intereses.",
            color: "#ef4444"
        },
        {
            icon: "fa-layer-group",
            title: "Diversificación",
            content: "No pongas todos los huevos en la misma canasta. Distribuir tus inversiones en diferentes activos reduce el riesgo y suaviza la volatilidad de tu portafolio.",
            color: "#f59e0b"
        },
        {
            icon: "fa-bullseye",
            title: "Metas SMART",
            content: "Define objetivos claros: Específicos (Specific), Medibles (Measurable), Alcanzables (Achievable), Relevantes (Relevant) y con Tiempo definido (Time-bound).",
            color: "#ec4899"
        }
    ];

    return (
        <section id="view-education" className="view animate-fade-in">
            <div className="page-container">
                <header className="view-header">
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Educación Financiera</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Conceptos clave para dominar tus finanzas personales.</p>
                    </div>
                </header>

                <div className="education-grid animate-slide-up" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                    gap: '2rem',
                    paddingBottom: '2rem'
                }}>
                    {topics.map((topic, index) => (
                        <div key={index} className="glass-panel" style={{
                            animationDelay: `${index * 0.1}s`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            borderTop: `4px solid ${topic.color}`
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '0.5rem'
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: `rgba(${parseInt(topic.color.slice(1, 3), 16)}, ${parseInt(topic.color.slice(3, 5), 16)}, ${parseInt(topic.color.slice(5, 7), 16)}, 0.1)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: topic.color,
                                    fontSize: '1.5rem'
                                }}>
                                    <i className={`fa-solid ${topic.icon}`}></i>
                                </div>
                                <h3 style={{ fontSize: '1.3rem', margin: 0 }}>{topic.title}</h3>
                            </div>
                            <p style={{
                                color: 'var(--text-muted)',
                                lineHeight: '1.6',
                                fontSize: '1rem'
                            }}>
                                {topic.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Education;
