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

    // Filter State
    const [filterType, setFilterType] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

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

    // Filter Logic
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesType = filterType === 'all' || t.type === filterType;
            const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
            const matchesSearch = t.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.category.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesType && matchesCategory && matchesSearch;
        });
    }, [transactions, filterType, filterCategory, searchTerm]);

    // Summary Stats based on filtered data
    const stats = useMemo(() => {
        const income = filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((acc, curr) => acc + Number(curr.amount), 0);
        const expense = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => acc + Number(curr.amount), 0);
        return { income, expense, balance: income - expense };
    }, [filteredTransactions]);

    // Unique Categories for Filter
    const categories = [...new Set(transactions.map(t => t.category))];

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
                    <h3>Historial de Transacciones</h3>

                    {/* Filters */}
                    <div className="filters-bar">
                        <div className="filter-group">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                <option value="all">Todos los Tipos</option>
                                <option value="income">Ingresos</option>
                                <option value="expense">Gastos</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                                <option value="all">Todas las Categorías</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

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
                                {filteredTransactions.map(t => (
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
                                {filteredTransactions.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                            No se encontraron movimientos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Transactions;
