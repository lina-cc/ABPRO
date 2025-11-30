import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const { user } = useAuth();
    const { calculateBalance, calculateIncome, calculateExpense, transactions, goals } = useData();

    const balance = calculateBalance();
    const income = calculateIncome();
    const expense = calculateExpense();

    // Get current date for display
    const currentDate = new Date().toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric'
    });
    const capitalizedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

    // Prepare data for Expense Chart
    const expenseCategories = {};
    transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            expenseCategories[t.category] = (expenseCategories[t.category] || 0) + Number(t.amount);
        });

    const expenseData = {
        labels: Object.keys(expenseCategories),
        datasets: [
            {
                data: Object.values(expenseCategories),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                ],
                borderWidth: 1,
            },
        ],
    };

    const balanceData = {
        labels: ['Ingresos', 'Gastos'],
        datasets: [
            {
                data: [income, expense],
                backgroundColor: ['#10b981', '#ef4444'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <section id="view-dashboard" className="view animate-fade-in">
            <div className="page-container">
                <header className="view-header">
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Resumen Financiero</h2>
                        <p id="welcome-message" style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                            Hola de nuevo, <span className="text-gradient" style={{ fontWeight: '700' }}>{user?.name}</span>
                        </p>
                    </div>
                    <div className="date-display">
                        <i className="fas fa-calendar-alt"></i>
                        {capitalizedDate}
                    </div>
                </header>

                <div className="stats-grid animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="stat-card glass-panel">
                        <h3>Balance Total</h3>
                        <p className="amount" id="total-balance">${balance}</p>
                    </div>
                    <div className="stat-card glass-panel income">
                        <h3>Ingresos (Mes)</h3>
                        <p className="amount" id="total-income">${income}</p>
                    </div>
                    <div className="stat-card glass-panel expense">
                        <h3>Gastos (Mes)</h3>
                        <p className="amount" id="total-expense">${expense}</p>
                    </div>
                </div>

                <div className="charts-grid animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <div className="chart-container glass-panel">
                        <h3>Gastos por Categoría</h3>
                        {Object.keys(expenseCategories).length > 0 ? (
                            <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                                <Doughnut data={expenseData} options={{ maintainAspectRatio: false }} />
                            </div>
                        ) : (
                            <p>No hay gastos registrados aún.</p>
                        )}
                    </div>
                    <div className="chart-container glass-panel">
                        <h3>Ingresos vs Gastos</h3>
                        <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                            <Doughnut data={balanceData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>

                {/* Goals Section */}
                <div className="dashboard-goals">
                    <h3><i className="fas fa-bullseye" style={{ color: 'var(--primary-color)' }}></i> Mis Metas (Top 3)</h3>
                    {goals.length > 0 ? (
                        <div className="goals-grid" style={{ marginTop: '0' }}>
                            {goals.slice(0, 3).map(goal => {
                                const progress = Math.min((goal.current / goal.target) * 100, 100);
                                return (
                                    <div key={goal.id} className="mini-goal-card">
                                        <div className="mini-goal-header">
                                            <h4>{goal.title}</h4>
                                            <small style={{ color: 'var(--text-muted)' }}>${goal.current} / ${goal.target}</small>
                                        </div>
                                        <div className="mini-goal-progress">
                                            <div className="mini-goal-bar" style={{ width: `${progress}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-muted)' }}>No tienes metas activas. ¡Crea una en la sección de Metas!</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
