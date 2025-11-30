import { useState } from 'react';
import { useData } from '../context/DataContext';

const Goals = () => {
    const { goals, addGoal, deleteGoal } = useData();
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');
    const [current, setCurrent] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newGoal = {
            id: Date.now(),
            name,
            target,
            current,
            deadline
        };
        addGoal(newGoal);
        // Reset form
        setName('');
        setTarget('');
        setCurrent('');
        setDeadline('');
    };

    return (
        <section id="view-goals" className="view">
            <header className="view-header">
                <h2>Metas de Ahorro</h2>
            </header>

            <div className="glass-panel form-container">
                <h3>Nueva Meta</h3>
                <form id="goal-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="input-group">
                            <input
                                type="text"
                                id="goal-name"
                                placeholder="Nombre de la meta"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="number"
                                id="goal-target"
                                placeholder="Monto Objetivo ($)"
                                required
                                min="1"
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="input-group">
                            <input
                                type="number"
                                id="goal-current"
                                placeholder="Ahorro Inicial ($)"
                                required
                                min="0"
                                value={current}
                                onChange={(e) => setCurrent(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="date"
                                id="goal-deadline"
                                required
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary">Crear Meta</button>
                </form>
            </div>

            <div id="goals-list" className="goals-grid">
                {goals.map(g => {
                    const progress = Math.min((g.current / g.target) * 100, 100);
                    return (
                        <div key={g.id} className="goal-card">
                            <div className="goal-header">
                                <div>
                                    <h4>{g.name}</h4>
                                    <small>Meta: {g.deadline}</small>
                                </div>
                                <button className="btn-delete-goal" onClick={() => deleteGoal(g.id)}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                            <div className="goal-progress-container">
                                <div className="goal-progress-bar" style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className="goal-stats">
                                <span>${g.current} / ${g.target}</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                        </div>
                    );
                })}
                {goals.length === 0 && <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>No hay metas definidas.</p>}
            </div>
        </section>
    );
};

export default Goals;
