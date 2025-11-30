import { state, saveUsers, saveData } from './state.js';
import { switchView } from './navigation.js';
import { loadDashboardData } from './dashboard.js';

const userNameDisplay = document.getElementById('user-name-display');

export function login(email, password) {
    const user = state.users.find(u => u.email === email && u.password === password);
    if (user) {
        state.currentUser = user;
        userNameDisplay.textContent = user.name;
        switchView('dashboard');
        loadDashboardData();
    } else {
        alert('Credenciales incorrectas');
    }
}

export function register(name, email, password) {
    if (state.users.find(u => u.email === email)) {
        alert('El correo ya está registrado');
        return;
    }

    const newUser = { id: Date.now(), name, email, password };
    state.users.push(newUser);
    saveUsers();

    // Initialize empty data for user
    state.data[newUser.id] = {
        transactions: [],
        goals: []
    };
    saveData();

    alert('Registro exitoso. Por favor inicia sesión.');
    switchView('login');
}

export function logout() {
    state.currentUser = null;
    switchView('landing');
}
