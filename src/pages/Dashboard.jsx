import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const { user } = useAuth();
    const { calculateBalance, calculateIncome, calculateExpense, transactions } = useData();

    const balance = calculateBalance();
    const income = calculateIncome();
    const expense = calculateExpense();

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
        <section id="view-dashboard" className="view">
            <header className="view-header">
                <h2>Resumen Financiero</h2>
                <p id="welcome-message">Hola, {user?.name}</p>
            </header>

            <div className="stats-grid">
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

            <div className="charts-grid">
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
        </section>
    );
};

export default Dashboard;
