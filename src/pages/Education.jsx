const Education = () => {
    return (
        <section id="view-education" className="view animate-fade-in">
            <header className="view-header">
                <h2>Educación Financiera</h2>
            </header>

            <div className="education-grid animate-slide-up">
                <div className="glass-panel">
                    <h3><i className="fa-solid fa-piggy-bank"></i> La Regla 50/30/20</h3>
                    <p>Una estrategia simple para administrar tu dinero:</p>
                    <ul>
                        <li><strong>50% Necesidades:</strong> Gastos fijos como arriendo, comida y servicios.</li>
                        <li><strong>30% Deseos:</strong> Entretenimiento, salidas y caprichos.</li>
                        <li><strong>20% Ahorro:</strong> Metas futuras y fondo de emergencia.</li>
                    </ul>
                </div>

                <div className="glass-panel" style={{ animationDelay: '0.2s' }}>
                    <h3><i className="fa-solid fa-chart-line"></i> Interés Compuesto</h3>
                    <p>Es el interés sobre el interés. Si ahorras e inviertes, tus ganancias generan más ganancias
                        con el tiempo. ¡Empieza joven!</p>
                </div>

                <div className="glass-panel" style={{ animationDelay: '0.4s' }}>
                    <h3><i className="fa-solid fa-shield-halved"></i> Fondo de Emergencia</h3>
                    <p>Antes de invertir, asegúrate de tener ahorrado entre 3 a 6 meses de tus gastos básicos para
                        imprevistos.</p>
                </div>
            </div>
        </section>
    );
};

export default Education;
