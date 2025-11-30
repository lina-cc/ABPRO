import { state, saveData } from './state.js';
import { formatCurrency } from './utils.js';
import { loadDashboardData } from './dashboard.js';

export function addTransaction(type, amount, category, date, description) {
    if (!state.currentUser) return;

    const newTransaction = {
        id: Date.now(),
        type,
        amount: parseFloat(amount),
        category,
        date,
        description
    };

    state.data[state.currentUser.id].transactions.push(newTransaction);
    saveData();
    updateUI();
    alert('Movimiento agregado correctamente');
    document.getElementById('transaction-form').reset();
    // Set date to today again
    document.getElementById('trans-date').valueAsDate = new Date();
}

export function deleteTransaction(id) {
    if (!state.currentUser) return;
    const transactions = state.data[state.currentUser.id].transactions;
    state.data[state.currentUser.id].transactions = transactions.filter(t => t.id !== id);
    saveData();
    updateUI();
}

export function renderTransactionList() {
    if (!state.currentUser) return;
    const list = document.getElementById('transaction-list');
    list.innerHTML = '';

    const transactions = [...state.data[state.currentUser.id].transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    transactions.forEach(t => {
        const li = document.createElement('li');
        li.className = 'transaction-item';
        li.innerHTML = `
            <div class="t-info">
                <h4>${t.category} <small>(${t.date})</small></h4>
                <small>${t.description || ''}</small>
            </div>
            <div class="t-actions">
                <span class="t-amount ${t.type}">${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}</span>
                <button class="btn-delete" data-id="${t.id}"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        list.appendChild(li);
    });
}

function updateUI() {
    loadDashboardData();
    renderTransactionList();
}
