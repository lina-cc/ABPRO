import { state } from './modules/state.js';
import { switchView } from './modules/navigation.js';
import { login, register, logout } from './modules/auth.js';
import { addTransaction, deleteTransaction, renderTransactionList } from './modules/transactions.js';
import { addGoal, deleteGoal, renderGoalsList } from './modules/goals.js';
import { loadDashboardData } from './modules/dashboard.js';

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Auth Forms
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        login(document.getElementById('login-email').value, document.getElementById('login-password').value);
    });

    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        register(
            document.getElementById('register-name').value,
            document.getElementById('register-email').value,
            document.getElementById('register-password').value
        );
    });

    // Button Navigations (Delegation)
    document.body.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-view]');
        if (trigger) {
            e.preventDefault();
            const view = trigger.dataset.view;
            switchView(view);
        }
    });

    // Logo Navigation
    document.querySelector('.nav-logo').addEventListener('click', () => {
        if (state.currentUser) {
            switchView('dashboard');
        } else {
            switchView('landing');
        }
    });

    document.getElementById('logout-btn').addEventListener('click', logout);

    // Transaction Form Listener
    document.getElementById('transaction-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addTransaction(
            document.getElementById('trans-type').value,
            document.getElementById('trans-amount').value,
            document.getElementById('trans-category').value,
            document.getElementById('trans-date').value,
            document.getElementById('trans-desc').value
        );
    });

    // Goal Form Listener
    document.getElementById('goal-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addGoal(
            document.getElementById('goal-name').value,
            document.getElementById('goal-target').value,
            document.getElementById('goal-current').value,
            document.getElementById('goal-deadline').value
        );
    });

    // Delete Buttons Delegation (Transactions)
    document.getElementById('transaction-list').addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-delete');
        if (btn) {
            const id = parseInt(btn.dataset.id);
            deleteTransaction(id);
        }
    });

    // Delete Buttons Delegation (Goals)
    document.getElementById('goals-list').addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-delete-goal');
        if (btn) {
            const id = parseInt(btn.dataset.id);
            deleteGoal(id);
        }
    });

    // Initial State
    switchView('landing');
});

// Initialize Date Input
document.getElementById('trans-date').valueAsDate = new Date();
