import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { calculateAverageMonthlySavings, projectGoalCompletion } from '../utils/mathUtils';

const Goals = () => {
    const { goals, addGoal, deleteGoal, transactions } = useData();

    // Form State
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');
    const [current, setCurrent] = useState('');
    const [interestRate, setInterestRate] = useState('0');

    // Strategy State
    const [goalType, setGoalType] = useState(null); // Start with no selection
    const [deadline, setDeadline] = useState('');
    const [monthlyContribution, setMonthlyContribution] = useState('');

    // Derived State for Preview
    const previewResult = useMemo(() => {
        const G = parseFloat(target);
        const S0 = parseFloat(current) || 0;
        const i = parseFloat(interestRate) / 100;
        const i_monthly = i / 12;

        if (!G || G <= S0) return null;

        if (goalType === 'target-date') {
            if (!deadline) return null;
            const today = new Date();
            const targetDate = new Date(deadline);
            const monthsDiff = (targetDate.getFullYear() - today.getFullYear()) * 12 + (targetDate.getMonth() - today.getMonth());
            const n = Math.max(1, monthsDiff);

            let A = 0;
            if (i_monthly > 0) {
                const factor = Math.pow(1 + i_monthly, n);
                A = (G - S0 * factor) * i_monthly / (factor - 1);
            } else {
                A = (G - S0) / n;
            }
            return { type: 'contribution', value: Math.max(0, A), months: n };
        } else if (goalType === 'target-contribution') {
            const A = parseFloat(monthlyContribution);
            if (!A || A <= 0) return null;

            let t = 0;
            let saldo = S0;
            const maxMonths = 1200;

            while (saldo < G && t < maxMonths) {
                saldo = (saldo + A) * (1 + i_monthly);
                t++;
            }

            return { type: 'duration', months: t, exceeded: t >= maxMonths };
        }
        return null;
    }, [target, current, interestRate, goalType, deadline, monthlyContribution]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newGoal = {
            id: Date.now(),
            name,
            target: parseFloat(target),
            current: parseFloat(current) || 0,
            interestRate: parseFloat(interestRate),
            goalType,
            deadline: goalType === 'target-date' ? deadline : null,
            monthlyContribution: goalType === 'target-contribution' ? parseFloat(monthlyContribution) : null,
            calculatedResult: previewResult
        };

        addGoal(newGoal);

        // Reset form
        setName('');
        setTarget('');
        setCurrent('');
        setInterestRate('0');
        setDeadline('');
        setMonthlyContribution('');
        setGoalType(null); // Reset selection
    };

    return (
        <section id="view-goals" className="view animate-fade-in">
            <div className="page-container">
                <header className="view-header">
                    <h2>Metas de Ahorro</h2>
                </header>

                <div className="glass-panel form-container animate-slide-up">
                    <h3>Nueva Meta</h3>

                    <div className="goal-type-selector" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem',
                        marginBottom: '2rem'
                    }}>
                        <button
                            type="button"
                            className={`btn-goal-type ${goalType === 'target-date' ? 'active' : ''}`}
                            onClick={() => setGoalType('target-date')}
                            style={{
                                padding: '2rem',
                                borderRadius: '16px',
                                border: '2px solid var(--border-color)',
                                background: goalType === 'target-date' ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--bg-secondary)',
                                color: 'var(--text-color)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem',
                                borderColor: goalType === 'target-date' ? 'var(--primary-color)' : 'var(--border-color)',
                                boxShadow: goalType === 'target-date' ? '0 4px 12px rgba(var(--primary-rgb), 0.2)' : 'none',
                                transform: goalType === 'target-date' ? 'translateY(-2px)' : 'none'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                                e.currentTarget.style.borderColor = 'var(--primary-color)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = goalType === 'target-date' ? 'translateY(-2px)' : 'none';
                                e.currentTarget.style.boxShadow = goalType === 'target-date' ? '0 4px 12px rgba(var(--primary-rgb), 0.2)' : 'none';
                                e.currentTarget.style.borderColor = goalType === 'target-date' ? 'var(--primary-color)' : 'var(--border-color)';
                            }}
                        >
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'var(--primary-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                color: 'white',
                                marginBottom: '0.5rem'
                            }}>
                                <i className="fas fa-calendar-alt"></i>
                            </div>
                            <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Definir Fecha Límite</span>
                            <span style={{ fontSize: '0.9rem', opacity: 0.8, textAlign: 'center' }}>
                                Quiero lograr mi meta para una fecha específica.
                            </span>
                        </button>

                        <button
                            type="button"
                            className={`btn-goal-type ${goalType === 'target-contribution' ? 'active' : ''}`}
                            onClick={() => setGoalType('target-contribution')}
                            style={{
                                padding: '2rem',
                                borderRadius: '16px',
                                border: '2px solid var(--border-color)',
                                background: goalType === 'target-contribution' ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--bg-secondary)',
                                color: 'var(--text-color)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem',
                                borderColor: goalType === 'target-contribution' ? 'var(--primary-color)' : 'var(--border-color)',
                                boxShadow: goalType === 'target-contribution' ? '0 4px 12px rgba(var(--primary-rgb), 0.2)' : 'none',
                                transform: goalType === 'target-contribution' ? 'translateY(-2px)' : 'none'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                                e.currentTarget.style.borderColor = 'var(--primary-color)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = goalType === 'target-contribution' ? 'translateY(-2px)' : 'none';
                                e.currentTarget.style.boxShadow = goalType === 'target-contribution' ? '0 4px 12px rgba(var(--primary-rgb), 0.2)' : 'none';
                                e.currentTarget.style.borderColor = goalType === 'target-contribution' ? 'var(--primary-color)' : 'var(--border-color)';
                            }}
                        >
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'var(--secondary-color, #2ecc71)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                color: 'white',
                                marginBottom: '0.5rem'
                            }}>
                                <i className="fas fa-piggy-bank"></i>
                            </div>
                            <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Definir Aporte Mensual</span>
                            <span style={{ fontSize: '0.9rem', opacity: 0.8, textAlign: 'center' }}>
                                Quiero ahorrar una cantidad fija cada mes.
                            </span>
                        </button>
                    </div>

                    {goalType && (
                        <form id="goal-form" onSubmit={handleSubmit} className="animate-fade-in">
                            <div className="form-row">
                                <div className="input-group">
                                    <label>Nombre de la Meta</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Vacaciones, Auto Nuevo"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Monto Objetivo ($)</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        required
                                        min="1"
                                        value={target}
                                        onChange={(e) => setTarget(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label>Ahorro Inicial ($)</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        min="0"
                                        value={current}
                                        onChange={(e) => setCurrent(e.target.value)}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Tasa de Interés Anual (%)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        min="0"
                                        step="0.1"
                                        value={interestRate}
                                        onChange={(e) => setInterestRate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                {goalType === 'target-date' ? (
                                    <div className="input-group">
                                        <label>Fecha Límite</label>
                                        <input
                                            type="date"
                                            required
                                            value={deadline}
                                            onChange={(e) => setDeadline(e.target.value)}
                                        />
                                    </div>
                                ) : (
                                    <div className="input-group">
                                        <label>Aporte Mensual ($)</label>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            required
                                            min="1"
                                            value={monthlyContribution}
                                            onChange={(e) => setMonthlyContribution(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Live Preview */}
                            {previewResult && (
                                <div className="calculation-preview" style={{
                                    background: 'rgba(var(--primary-rgb), 0.1)',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    margin: '1rem 0',
                                    borderLeft: '4px solid var(--primary-color)'
                                }}>
                                    {goalType === 'target-date' ? (
                                        <>
                                            <h4 style={{ margin: 0, color: 'var(--primary-color)' }}>Plan Recomendado</h4>
                                            <p style={{ margin: '0.5rem 0 0' }}>
                                                Para llegar a la meta en <strong>{previewResult.months} meses</strong>, debes ahorrar:
                                                <strong style={{ fontSize: '1.2rem', display: 'block', marginTop: '0.25rem' }}>
                                                    ${previewResult.value.toLocaleString('es-CL', { maximumFractionDigits: 0 })} / mes
                                                </strong>
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <h4 style={{ margin: 0, color: 'var(--primary-color)' }}>Proyección</h4>
                                            <p style={{ margin: '0.5rem 0 0' }}>
                                                Con un aporte de ${parseFloat(monthlyContribution).toLocaleString('es-CL')}, alcanzarás tu meta en:
                                                <strong style={{ fontSize: '1.2rem', display: 'block', marginTop: '0.25rem' }}>
                                                    {previewResult.exceeded ? 'Más de 100 años (Meta difícil)' : `${previewResult.months} meses`}
                                                </strong>
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="button" className="btn-secondary" onClick={() => setGoalType(null)} style={{ flex: 1 }}>Cancelar</button>
                                <button type="submit" className="btn-primary" style={{ flex: 2 }}>Crear Meta</button>
                            </div>
                        </form>
                    )}
                </div>

                <div id="goals-list" className="goals-grid animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    {goals.map(g => {
                        const progress = Math.min((g.current / g.target) * 100, 100);

                        return (
                            <div key={g.id} className="goal-card">
                                <div className="goal-header">
                                    <div>
                                        <h4>{g.name}</h4>
                                        <div className="goal-badge">
                                            {g.goalType === 'target-date' ? '📅 Fecha Fija' : '💰 Aporte Fijo'}
                                        </div>
                                    </div>
                                    <button className="btn-delete-goal" onClick={() => deleteGoal(g.id)} title="Eliminar meta">
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>

                                <div className="goal-stats">
                                    <div>
                                        <div className="goal-amount">${g.current.toLocaleString('es-CL')}</div>
                                        <div className="goal-target">de ${g.target.toLocaleString('es-CL')}</div>
                                    </div>
                                    <div className="goal-percentage">{Math.round(progress)}%</div>
                                </div>

                                <div className="goal-progress-container">
                                    <div className="goal-progress-bar" style={{ width: `${progress}%` }}></div>
                                </div>

                                <div className="goal-footer">
                                    {g.goalType === 'target-date' ? (
                                        <>
                                            <div className="goal-detail-icon">
                                                <i className="fas fa-bullseye"></i>
                                            </div>
                                            <div className="goal-detail-text">
                                                <span className="goal-detail-label">Meta: {new Date(g.deadline).toLocaleDateString()}</span>
                                                {g.calculatedResult && (
                                                    <span className="goal-detail-value">
                                                        Ahorro sugerido: ${Math.round(g.calculatedResult.value).toLocaleString('es-CL')}/mes
                                                    </span>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="goal-detail-icon">
                                                <i className="fas fa-coins"></i>
                                            </div>
                                            <div className="goal-detail-text">
                                                <span className="goal-detail-label">Aporte: ${g.monthlyContribution?.toLocaleString('es-CL')}/mes</span>
                                                {g.calculatedResult && (
                                                    <span className="goal-detail-value">
                                                        Tiempo estimado: {g.calculatedResult.months} meses
                                                    </span>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {goals.length === 0 && <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>No hay metas definidas.</p>}
                </div>
            </div>
        </section>
    );
};

export default Goals;
