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

                <header className="view-header" style={{ marginTop: '4rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Recursos Recomendados</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Herramientas y lecturas esenciales para profundizar tu aprendizaje.</p>
                    </div>
                </header>

                <div className="resources-grid animate-slide-up" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                    gap: '2rem',
                    paddingBottom: '2rem'
                }}>
                    {[
                        {
                            icon: "fa-book-open",
                            title: "Educación Sernac",
                            content: "Biblioteca completa con material educativo, guías y consejos prácticos para ser un consumidor informado.",
                            link: "https://www.sernac.cl/portal/607/w3-propertyvalue-14523.html#biblioteca",
                            color: "#EF4444"
                        },
                        {
                            icon: "fa-file-invoice-dollar",
                            title: "Presupuesto Familiar",
                            content: "Guía oficial de la CMF para aprender paso a paso a organizar los ingresos y gastos de tu hogar.",
                            link: "https://www.cmfeduca.cl/educa/621/w3-channel.html",
                            color: "#10B981"
                        },
                        {
                            icon: "fa-lightbulb",
                            title: "Fintualist",
                            content: "Artículos frescos y sencillos sobre economía, inversiones y actualidad financiera para todos.",
                            link: "https://fintualist.com/chile/educacion-financiera/",
                            color: "#8B5CF6"
                        },
                        {
                            icon: "fa-magnifying-glass-chart",
                            title: "Comparador de Créditos",
                            content: "Simula y compara diferentes opciones de crédito (consumo, hipotecario) antes de tomar una decisión.",
                            link: "https://www.sernac.cl/portal/619/w3-article-84607.html",
                            color: "#F59E0B"
                        }
                    ].map((resource, index) => (
                        <a
                            key={index}
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-panel resource-card"
                            style={{
                                animationDelay: `${index * 0.1 + 0.3}s`,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                borderTop: `4px solid ${resource.color}`,
                                textDecoration: 'none',
                                color: 'inherit',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = `0 10px 20px -5px ${resource.color}40`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
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
                                    background: `rgba(${parseInt(resource.color.slice(1, 3), 16)}, ${parseInt(resource.color.slice(3, 5), 16)}, ${parseInt(resource.color.slice(5, 7), 16)}, 0.1)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: resource.color,
                                    fontSize: '1.5rem'
                                }}>
                                    <i className={`fa-solid ${resource.icon}`}></i>
                                </div>
                                <h3 style={{ fontSize: '1.3rem', margin: 0 }}>{resource.title}</h3>
                                <i className="fa-solid fa-external-link-alt" style={{ marginLeft: 'auto', fontSize: '1rem', opacity: 0.5 }}></i>
                            </div>
                            <p style={{
                                color: 'var(--text-muted)',
                                lineHeight: '1.6',
                                fontSize: '1rem',
                                margin: 0
                            }}>
                                {resource.content}
                            </p>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Education;
