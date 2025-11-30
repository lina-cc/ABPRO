import { state, saveData } from './state.js';
import { formatCurrency } from './utils.js';

export function addGoal(name, target, current, deadline) {
    if (!state.currentUser) return;

    const newGoal = {
        id: Date.now(),
        name,
        target: parseFloat(target),
        current: parseFloat(current),
        deadline
    };

    state.data[state.currentUser.id].goals.push(newGoal);
    saveData();
    renderGoalsList();
    alert('Meta creada exitosamente');
    document.getElementById('goal-form').reset();
}

export function deleteGoal(id) {
    if (!state.currentUser) return;
    state.data[state.currentUser.id].goals = state.data[state.currentUser.id].goals.filter(g => g.id !== id);
    saveData();
    renderGoalsList();
}

export function renderGoalsList() {
    if (!state.currentUser) return;
    const list = document.getElementById('goals-list');
    list.innerHTML = '';

    const goals = state.data[state.currentUser.id].goals;

    goals.forEach(g => {
        const percent = Math.min(100, (g.current / g.target) * 100);
        const remaining = g.target - g.current;

        // Simple Projection
        const projectionMsg = remaining <= 0
            ? '¡Meta Alcanzada! 🎉'
            : `Faltan ${formatCurrency(remaining)} para cumplir tu meta.`;

        const card = document.createElement('div');
        card.className = 'goal-card';
        card.innerHTML = `
            <div class="goal-header">
                <div>
                    <h4>${g.name}</h4>
                    <small>Fecha límite: ${g.deadline}</small>
                </div>
                <button class="btn-delete-goal" data-id="${g.id}"><i class="fa-solid fa-trash"></i></button>
            </div>
            <div class="goal-progress-container">
                <div class="goal-progress-bar" style="width: ${percent}%"></div>
            </div>
            <div class="goal-stats">
                <span>${formatCurrency(g.current)}</span>
                <span>${Math.round(percent)}%</span>
                <span>${formatCurrency(g.target)}</span>
            </div>
            <div class="goal-projection">
                <i class="fa-solid fa-chart-line"></i> ${projectionMsg}
            </div>
        `;
        list.appendChild(card);
    });
}
