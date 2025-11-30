import { state } from './state.js';
import { formatCurrency } from './utils.js';

let expenseChart = null;
let balanceChart = null;

export function loadDashboardData() {
    if (!state.currentUser) return;

    const userData = state.data[state.currentUser.id];
    const transactions = userData.transactions;

    // Calculate Totals
    let totalIncome = 0;
    let totalExpense = 0;
    const expensesByCategory = {};

    transactions.forEach(t => {
        if (t.type === 'income') {
            totalIncome += t.amount;
        } else {
            totalExpense += t.amount;
            // Category aggregation
            expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
        }
    });

    const balance = totalIncome - totalExpense;

    // Update DOM
    document.getElementById('welcome-message').textContent = `Hola, ${state.currentUser.name}`;
    document.getElementById('total-balance').textContent = formatCurrency(balance);
    document.getElementById('total-income').textContent = formatCurrency(totalIncome);
    document.getElementById('total-expense').textContent = formatCurrency(totalExpense);

    // Update Charts
    updateCharts(totalIncome, totalExpense, expensesByCategory);
}

function updateCharts(income, expense, expensesByCategory) {
    const ctxExpense = document.getElementById('expenseChart').getContext('2d');
    const ctxBalance = document.getElementById('balanceChart').getContext('2d');

    // Destroy previous instances if they exist
    if (expenseChart) expenseChart.destroy();
    if (balanceChart) balanceChart.destroy();

    // Expense Pie Chart
    expenseChart = new Chart(ctxExpense, {
        type: 'doughnut',
        data: {
            labels: Object.keys(expensesByCategory),
            datasets: [{
                data: Object.values(expensesByCategory),
                backgroundColor: [
                    '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#94a3b8' } }
            }
        }
    });

    // Balance Bar Chart
    balanceChart = new Chart(ctxBalance, {
        type: 'bar',
        data: {
            labels: ['Ingresos', 'Gastos'],
            datasets: [{
                label: 'Monto',
                data: [income, expense],
                backgroundColor: ['#10b981', '#ef4444'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}
