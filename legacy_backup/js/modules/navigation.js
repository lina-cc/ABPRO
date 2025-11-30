import { state } from './state.js';

export const views = {
    landing: document.getElementById('view-landing'),
    login: document.getElementById('view-login'),
    register: document.getElementById('view-register'),
    dashboard: document.getElementById('view-dashboard'),
    transactions: document.getElementById('view-transactions'),
    goals: document.getElementById('view-goals'),
    education: document.getElementById('view-education')
};

const privateNavItems = document.querySelectorAll('.private-nav');
const publicNavItems = document.querySelectorAll('.public-nav');
const navLinks = document.querySelectorAll('.nav-links a');

export function updateNavState() {
    if (state.currentUser) {
        // User Logged In
        privateNavItems.forEach(el => el.classList.remove('hidden'));
        publicNavItems.forEach(el => el.classList.add('hidden'));
    } else {
        // User Logged Out
        privateNavItems.forEach(el => el.classList.add('hidden'));
        publicNavItems.forEach(el => el.classList.remove('hidden'));
    }
}

export function switchView(viewName) {
    // Hide all views
    Object.values(views).forEach(el => {
        if (el) el.classList.add('hidden');
        if (el) el.classList.remove('active');
    });

    // Show target view
    if (views[viewName]) {
        views[viewName].classList.remove('hidden');
        views[viewName].classList.add('active');
    } else {
        console.error(`View "${viewName}" not found.`);
    }

    // Update Nav State based on Auth
    updateNavState();

    // Update Active Link (only for private nav)
    navLinks.forEach(link => {
        if (link.dataset.view === viewName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
