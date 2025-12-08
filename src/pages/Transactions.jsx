import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';

const Transactions = () => {
    const { transactions, addTransaction, deleteTransaction } = useData();

    // Form State
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



    // Summary Stats based on all data
    const stats = useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, curr) => acc + Number(curr.amount), 0);
        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => acc + Number(curr.amount), 0);
        return { income, expense, balance: income - expense };
    }, [transactions]);

    // Categories Logic
    const defaultCategories = ['Comida', 'Transporte', 'Vivienda', 'Entretenimiento', 'Salud', 'Salario', 'Educación', 'Servicios', 'Ahorro', 'Inversión', 'Otros'];

    // Merge default categories with those existing in transactions for dynamic suggestions
    const allCategories = useMemo(() => {
        const usedCategories = transactions.map(t => t.category);
        return [...new Set([...defaultCategories, ...usedCategories])].sort();
    }, [transactions]);

    return (
        <section id="view-transactions" className="view animate-fade-in">
            <div className="page-container">
                <header className="view-header">
                    <h2>Mis Movimientos</h2>
                </header>

                {/* Summary Cards */}
                <div className="transactions-summary animate-slide-up">
                    <div className="summary-card-small">
                        <h4>Ingresos</h4>
                        <p className="amount" style={{ color: 'var(--success)' }}>+${stats.income}</p>
                    </div>
                    <div className="summary-card-small">
                        <h4>Gastos</h4>
                        <p className="amount" style={{ color: 'var(--danger)' }}>-${stats.expense}</p>
                    </div>
                    <div className="summary-card-small">
                        <h4>Balance</h4>
                        <p className="amount" style={{ color: stats.balance >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                            ${stats.balance}
                        </p>
                    </div>
                </div>

                <div className="glass-panel form-container animate-slide-up" style={{ animationDelay: '0.1s' }}>
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
                                    onWheel={(e) => e.target.blur()}
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
                                    {allCategories.map(cat => (
                                        <option key={cat} value={cat} />
                                    ))}
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
                    <h3>Últimos 10 Movimientos</h3>

                    {/* Table View */}
                    <div className="transactions-table-container">
                        <table className="transactions-table">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Categoría</th>
                                    <th>Descripción</th>
                                    <th>Tipo</th>
                                    <th>Monto</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.slice(0, 10).map(t => (
                                    <tr key={t.id}>
                                        <td>{t.date}</td>
                                        <td>{t.category}</td>
                                        <td>{t.desc || '-'}</td>
                                        <td>
                                            <span className={`badge ${t.type}`}>
                                                {t.type === 'income' ? 'Ingreso' : 'Gasto'}
                                            </span>
                                        </td>
                                        <td className={`t-amount ${t.type}`}>
                                            {t.type === 'income' ? '+' : '-'}${t.amount}
                                        </td>
                                        <td>
                                            <button className="btn-delete" style={{ marginLeft: 0, opacity: 1 }} onClick={() => deleteTransaction(t.id)}>
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                            No se encontraron movimientos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div >
            </div >
        </section >
    );
};

export default Transactions;
