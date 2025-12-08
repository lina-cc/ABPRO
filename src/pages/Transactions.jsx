import { useState, useMemo, useEffect, useRef } from 'react';
import { useData, getCategoryStyle } from '../context/DataContext';

const Transactions = () => {
    const { transactions, addTransaction, deleteTransaction, allCategories, addCategoryMetadata } = useData();

    // Form State
    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [desc, setDesc] = useState('');

    // Custom Dropdown State
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [searchCategory, setSearchCategory] = useState('');
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [newCatIcon, setNewCatIcon] = useState('fa-circle-question');
    const [newCatColor, setNewCatColor] = useState('#94a3b8');

    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setCategoryDropdownOpen(false);
            }
        };

        if (categoryDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [categoryDropdownOpen]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        // If it's a new category, save its metadata first
        if (isNewCategory && category) {
            await addCategoryMetadata(category, newCatIcon, newCatColor);
        }

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
        setIsNewCategory(false);
        setNewCatIcon('fa-circle-question');
        setNewCatColor('#94a3b8');
        setSearchCategory('');
        setCategoryDropdownOpen(false);
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

    // Available Categories for Dropdown
    const sortedCategories = useMemo(() => {
        return Object.keys(allCategories).sort();
    }, [allCategories]);

    return (
        <section id="view-transactions" className="view animate-fade-in">
            <div className="page-container">
                <header className="view-header">
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Mis Movimientos</h2>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                            Registra y gestiona tus ingresos y gastos para mantener tus cuentas claras.
                        </p>
                    </div>
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

                <div className="glass-panel form-container animate-slide-up" style={{ animationDelay: '0.1s', position: 'relative', zIndex: 10 }}>
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
                            <div
                                className="input-group"
                                style={{ position: 'relative', zIndex: categoryDropdownOpen ? 1001 : 1 }}
                                ref={dropdownRef}
                            >
                                {/* Custom Dropdown Trigger */}
                                <div
                                    className="custom-dropdown-trigger"
                                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                                    style={{
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '12px',
                                        padding: '1rem',
                                        background: 'var(--bg-card)',
                                        color: category ? 'var(--text-main)' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    {category ? (
                                        <>
                                            <i className={`fa-solid ${getCategoryStyle(category, allCategories).icon || 'fa-circle-question'}`} style={{ color: getCategoryStyle(category, allCategories).color, display: 'inline-block', width: '24px', textAlign: 'center', position: 'static' }}></i>
                                            {category}
                                        </>
                                    ) : 'Seleccionar Categoría'}
                                    <i className="fas fa-chevron-down" style={{ marginLeft: 'auto', fontSize: '0.8rem', position: 'static' }}></i>
                                </div>
                                {categoryDropdownOpen && (
                                    <div className="custom-dropdown-menu" style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        width: '100%',
                                        maxHeight: '300px',
                                        overflowY: 'auto',
                                        background: 'var(--bg-dark)', // Solid background
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '12px',
                                        marginTop: '5px',
                                        zIndex: 1005, // Higher than nav or other elements if necessary
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)', // Stronger shadow
                                        padding: '10px'
                                    }}>
                                        {/* Create New Option Input */}
                                        <input
                                            type="text"
                                            placeholder="Buscar o Crear Nueva..."
                                            value={searchCategory}
                                            onChange={(e) => setSearchCategory(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            style={{
                                                width: '100%',
                                                padding: '0.8rem',
                                                marginBottom: '10px',
                                                borderRadius: '8px',
                                                border: '1px solid var(--glass-border)',
                                                background: 'rgba(255,255,255,0.05)',
                                                color: 'var(--text-main)'
                                            }}
                                            autoFocus
                                        />

                                        {/* Filtered List */}
                                        <div className="category-list">
                                            {sortedCategories.filter(cat => cat.toLowerCase().includes(searchCategory.toLowerCase())).map(cat => (
                                                <div
                                                    key={cat}
                                                    className="dropdown-item"
                                                    onClick={() => {
                                                        setCategory(cat);
                                                        setCategoryDropdownOpen(false);
                                                        setSearchCategory('');
                                                        setIsNewCategory(false);
                                                    }}
                                                    style={{
                                                        padding: '10px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                        borderRadius: '8px',
                                                        marginBottom: '2px',
                                                        transition: 'background 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <i className={`fa-solid ${getCategoryStyle(cat, allCategories).icon || 'fa-circle-question'}`} style={{ color: getCategoryStyle(cat, allCategories).color, width: '24px', textAlign: 'center', display: 'inline-block', position: 'static' }}></i>
                                                    {cat}
                                                </div>
                                            ))}

                                            {/* Create New Option */}
                                            {searchCategory && !sortedCategories.some(c => c.toLowerCase() === searchCategory.toLowerCase()) && (
                                                <div
                                                    className="dropdown-item create-new"
                                                    onClick={() => {
                                                        setCategory(searchCategory);
                                                        setCategoryDropdownOpen(false);
                                                        setIsNewCategory(true);
                                                        // Default icons/color for new category
                                                        setNewCatIcon('fa-circle-question');
                                                        setNewCatColor('#94a3b8');
                                                    }}
                                                    style={{
                                                        padding: '10px',
                                                        cursor: 'pointer',
                                                        color: 'var(--primary-color)',
                                                        fontWeight: 'bold',
                                                        borderTop: '1px solid var(--glass-border)',
                                                        marginTop: '5px'
                                                    }}
                                                >
                                                    <i className="fas fa-plus"></i> Crear "{searchCategory}"
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* New Category Setup UI */}
                            {isNewCategory && category && (
                                <div className="glass-panel animate-fade-in" style={{ marginTop: '1rem', padding: '1rem', border: '1px solid var(--primary-color)', background: 'rgba(var(--primary-rgb), 0.05)' }}>
                                    <h4 style={{ margin: '0 0 1rem 0' }}><i className="fas fa-magic"></i> Personalizar Nueva Categoría: {category}</h4>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Elige un Icono:</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(30px, 1fr))', gap: '10px', maxHeight: '100px', overflowY: 'auto' }}>
                                            {['fa-shopping-cart', 'fa-car', 'fa-home', 'fa-utensils', 'fa-gamepad', 'fa-heartbeat', 'fa-graduation-cap', 'fa-plane', 'fa-paw', 'fa-dumbbell', 'fa-gift', 'fa-music', 'fa-book', 'fa-laptop', 'fa-mobile-alt', 'fa-tools', 'fa-tshirt', 'fa-coffee', 'fa-beer', 'fa-hamburger'].map(icon => (
                                                <div
                                                    key={icon}
                                                    onClick={() => setNewCatIcon(icon)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        padding: '5px',
                                                        borderRadius: '5px',
                                                        textAlign: 'center',
                                                        background: newCatIcon === icon ? 'var(--primary-color)' : 'transparent',
                                                        color: newCatIcon === icon ? '#fff' : 'var(--text-main)'
                                                    }}
                                                >
                                                    <i className={`fas ${icon}`}></i>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Elige un Color:</label>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            {['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#64748b'].map(color => (
                                                <div
                                                    key={color}
                                                    onClick={() => setNewCatColor(color)}
                                                    style={{
                                                        width: '24px',
                                                        height: '24px',
                                                        borderRadius: '50%',
                                                        background: color,
                                                        cursor: 'pointer',
                                                        border: newCatColor === color ? '2px solid white' : 'none',
                                                        boxShadow: newCatColor === color ? '0 0 0 2px var(--primary-color)' : 'none'
                                                    }}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <i
                                                    className={`fas ${getCategoryStyle(t.category).icon}`}
                                                    style={{ color: getCategoryStyle(t.category).color, width: '20px', textAlign: 'center' }}
                                                ></i>
                                                {t.category}
                                            </div>
                                        </td>
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
