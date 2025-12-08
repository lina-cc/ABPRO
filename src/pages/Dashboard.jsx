import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
    getCurrentAndPreviousMonthData,
    calculateMonthlyVariation,
    calculateAverageMonthlySavings
} from '../utils/mathUtils';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const { user } = useAuth();
    const { calculateBalance, calculateIncome, calculateExpense, transactions, goals } = useData();

    const balance = calculateBalance();
    const income = calculateIncome();
    const expense = calculateExpense();

    // Math Calculations
    const { current, previous } = getCurrentAndPreviousMonthData(transactions);
    const incomeVariation = calculateMonthlyVariation(current.income, previous.income);
    const expenseVariation = calculateMonthlyVariation(current.expense, previous.expense);
    const averageSavings = calculateAverageMonthlySavings(transactions);

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
                        <p className="amount" id="total-income">${current.income}</p>
                        {renderVariation(incomeVariation)}
                    </div>
                    <div className="stat-card glass-panel expense">
                        <h3>Gastos (Mes)</h3>
                        <p className="amount" id="total-expense">${current.expense}</p>
                        {/* Invertir lógica de color para gastos: subir es malo (rojo), bajar es bueno (verde) - Opcional, por ahora mantenemos consistencia matemática */}
                        {renderVariation(expenseVariation)}
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
                <div className="dashboard-goals animate-slide-up" style={{ animationDelay: '0.6s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}><i className="fas fa-bullseye" style={{ color: 'var(--primary-color)', marginRight: '10px' }}></i> Mis Metas Principales</h3>
                        <a href="/goals" className="btn-secondary small">Ver Todas</a>
                    </div>

                    {goals.length > 0 ? (
                        <div className="goals-grid" style={{ marginTop: '0' }}>
                            {goals.slice(0, 3).map(g => {
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
                                                        <span className="goal-detail-label">Meta</span>
                                                        <span className="goal-detail-value">{new Date(g.deadline).toLocaleDateString()}</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="goal-detail-icon">
                                                        <i className="fas fa-coins"></i>
                                                    </div>
                                                    <div className="goal-detail-text">
                                                        <span className="goal-detail-label">Aporte Mensual</span>
                                                        <span className="goal-detail-value">${g.monthlyContribution?.toLocaleString('es-CL')}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
                            <i className="fas fa-rocket" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'block' }}></i>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Aún no tienes metas definidas. ¡Es hora de planificar tu futuro!</p>
                            <a href="/goals" className="btn-primary">Crear mi primera meta</a>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
