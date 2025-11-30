import { useState } from 'react';
import { useData } from '../context/DataContext';

const Transactions = () => {
    const { transactions, addTransaction, deleteTransaction } = useData();
    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [desc, setDesc] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newTransaction = {
            id: Date.now(),
            type,
            amount,
            category,
            date,
            desc
        };
        addTransaction(newTransaction);
        // Reset form
        setAmount('');
        setCategory('');
        setDate('');
        setDesc('');
    };

    return (
        <section id="view-transactions" className="view animate-fade-in">
            <div className="page-container">
                <header className="view-header">
                    <h2>Mis Movimientos</h2>
                </header>

                <div className="glass-panel form-container animate-slide-up">
                    <h3>Agregar Nuevo Movimiento</h3>
                    <form id="transaction-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="input-group">
                                <select id="trans-type" required value={type} onChange={(e) => setType(e.target.value)}>
                                    <option value="expense">Gasto</option>
                                    <option value="income">Ingreso</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <input
                                    type="number"
                                    id="trans-amount"
                                    placeholder="Monto ($)"
                                    required
                                    min="1"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="trans-category"
                                    placeholder="Categoría (ej. Comida, Transporte)"
                                    required
                                    list="category-suggestions"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                                <datalist id="category-suggestions">
                                    <option value="Comida" />
                                    <option value="Transporte" />
                                    <option value="Vivienda" />
                                    <option value="Entretenimiento" />
                                    <option value="Salud" />
                                    <option value="Salario" />
                                    <option value="Otros" />
                                </datalist>
                            </div>
                            <div className="input-group">
                                <input
                                    type="date"
                                    id="trans-date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                id="trans-desc"
                                placeholder="Descripción (Opcional)"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn-primary">Agregar Movimiento</button>
                    </form>
                </div>

                <div className="glass-panel list-container animate-slide-up" style={{ marginTop: '2rem', animationDelay: '0.2s' }}>
                    <h3>Historial</h3>
                    <ul id="transaction-list" className="transaction-list">
                        {transactions.map(t => (
                            <li key={t.id} className="transaction-item">
                                <div className="t-info">
                                    <h4>{t.category} <small>({t.date})</small></h4>
                                    <small>{t.desc}</small>
                                </div>
                                <div className="t-actions">
                                    <span className={`t-amount ${t.type}`}>
                                        {t.type === 'income' ? '+' : '-'}${t.amount}
                                    </span>
                                    <button className="btn-delete" onClick={() => deleteTransaction(t.id)}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </li>
                        ))}
                        {transactions.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '1rem' }}>No hay movimientos registrados.</p>}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Transactions;
