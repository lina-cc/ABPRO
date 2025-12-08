import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { calculateTotalByType, calculateMonthlyVariation } from '../utils/mathUtils';

ChartJS.register(ArcElement, Tooltip, Legend);

const History = () => {
    const { transactions } = useData();

    // Default to current month: YYYY-MM
    const getCurrentMonth = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    };

    const [selectedDate, setSelectedDate] = useState(getCurrentMonth());

    // Helper to format month for display
    const formatDisplayDate = (dateString) => {
        const [year, month] = dateString.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    };

    // Filter Logic
    const { currentData, previousData, filteredTransactions } = useMemo(() => {
        // Current Month Data
        const currentParams = selectedDate.split('-');
        const currentYear = parseInt(currentParams[0]);
        const currentMonth = parseInt(currentParams[1]);

        const currentTrans = transactions.filter(t => {
            // Check if t.date exists and is valid
            if (!t.date) return false;
            // Assuming t.date is YYYY-MM-DD
            return t.date.startsWith(selectedDate);
        });

        // Previous Month Data
        // Month in Date constructor is 0-indexed. currentMonth is 1-indexed (from split).
        // previous month index = currentMonth - 1 - 1 = currentMonth - 2.
        const prevDateObj = new Date(currentYear, currentMonth - 2);
        const prevYear = prevDateObj.getFullYear();
        const prevMonthStr = String(prevDateObj.getMonth() + 1).padStart(2, '0');
        const prevDateStr = `${prevYear}-${prevMonthStr}`;

        const prevTrans = transactions.filter(t => t.date && t.date.startsWith(prevDateStr));

        return {
            currentData: {
                income: calculateTotalByType(currentTrans, 'income'),
                expense: calculateTotalByType(currentTrans, 'expense'),
                balance: calculateTotalByType(currentTrans, 'income') - calculateTotalByType(currentTrans, 'expense')
            },
            previousData: {
                income: calculateTotalByType(prevTrans, 'income'),
                expense: calculateTotalByType(prevTrans, 'expense')
            },
            filteredTransactions: currentTrans.sort((a, b) => new Date(b.date) - new Date(a.date)) // Newest first
        };
    }, [transactions, selectedDate]);

    // Variations
    const incomeVariation = calculateMonthlyVariation(currentData.income, previousData.income);
    const expenseVariation = calculateMonthlyVariation(currentData.expense, previousData.expense);

    // Chart Data
    const expenseCategories = {};
    filteredTransactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            expenseCategories[t.category] = (expenseCategories[t.category] || 0) + Number(t.amount);
        });

    const expenseChartData = {
        labels: Object.keys(expenseCategories),
        datasets: [{
            data: Object.values(expenseCategories),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            borderWidth: 1,
        }],
    };

    const balanceChartData = {
        labels: ['Ingresos', 'Gastos'],
        datasets: [{
            data: [currentData.income, currentData.expense],
            backgroundColor: ['#10b981', '#ef4444'],
            borderWidth: 1,
        }],
    };

    const renderVariation = (variation) => {
        if (variation === null) return <small className="variation-neutral">vs mes anterior</small>;
        const isPositive = variation > 0;
        const color = isPositive ? 'var(--success)' : 'var(--danger)';
        const icon = isPositive ? '⬆' : '⬇';
        return (
            <small style={{ color, fontWeight: 'bold' }}>
                {icon} {Math.abs(variation).toFixed(1)}% <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>vs mes anterior</span>
            </small>
        );
    };

    return (
        <section id="view-history" className="view animate-fade-in">
            <div className="page-container">
                <header className="view-header" style={{ marginBottom: '2rem' }}>
                    <div className="header-content">
                        <h2>Historial Financiero</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Analiza tu desempeño mensual</p>
                    </div>
                    <div className="date-selector-container">
                        <input
                            type="month"
                            className="month-selector"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{
                                padding: '0.8rem',
                                borderRadius: '12px',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--glass-border)',
                                color: 'var(--text-main)',
                                fontFamily: 'var(--font-main)',
                                fontSize: '1rem',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="stats-grid animate-slide-up">
                    <div className="stat-card glass-panel">
                        <h3>Balance ({formatDisplayDate(selectedDate)})</h3>
                        <p className="amount" style={{ color: currentData.balance >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                            ${currentData.balance}
                        </p>
                    </div>
                    <div className="stat-card glass-panel income">
                        <h3>Ingresos</h3>
                        <p className="amount" style={{ color: 'var(--success)' }}>${currentData.income}</p>
                        {renderVariation(incomeVariation)}
                    </div>
                    <div className="stat-card glass-panel expense">
                        <h3>Gastos</h3>
                        <p className="amount" style={{ color: 'var(--danger)' }}>${currentData.expense}</p>
                        {renderVariation(expenseVariation)}
                    </div>
                </div>

                {/* Charts */}
                <div className="charts-grid animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="chart-container glass-panel">
                        <h3>Distribución de Gastos</h3>
                        {Object.keys(expenseCategories).length > 0 ? (
                            <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                                <Doughnut data={expenseChartData} options={{ maintainAspectRatio: false }} />
                            </div>
                        ) : (
                            <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>No hay gastos registrados en este mes.</p>
                        )}
                    </div>
                    <div className="chart-container glass-panel">
                        <h3>Flujo de Caja</h3>
                        {currentData.income > 0 || currentData.expense > 0 ? (
                            <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                                <Doughnut data={balanceChartData} options={{ maintainAspectRatio: false }} />
                            </div>
                        ) : (
                            <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>No hay movimientos registrados.</p>
                        )}
                    </div>
                </div>

                {/* Transaction List */}
                <div className="glass-panel animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <h3>Movimientos de {formatDisplayDate(selectedDate)}</h3>
                    <div className="transactions-table-container">
                        <table className="transactions-table" style={{ width: '100%', marginTop: '1rem' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
                                    <th style={{ padding: '1rem' }}>Fecha</th>
                                    <th style={{ padding: '1rem' }}>Categoría</th>
                                    <th style={{ padding: '1rem' }}>Descripción</th>
                                    <th style={{ padding: '1rem' }}>Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map(t => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                        <td style={{ padding: '1rem' }}>{t.date}</td>
                                        <td style={{ padding: '1rem' }}>{t.category}</td>
                                        <td style={{ padding: '1rem' }}>{t.desc || '-'}</td>
                                        <td style={{ padding: '1rem', color: t.type === 'income' ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                                            {t.type === 'income' ? '+' : '-'}${t.amount}
                                        </td>
                                    </tr>
                                ))}
                                {filteredTransactions.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                            No hay movimientos para este mes.
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

export default History;
