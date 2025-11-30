const safeParse = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        console.error(`Error parsing ${key} from localStorage`, e);
        return fallback;
    }
};

export const state = {
    currentUser: null,
    users: safeParse('gesfinapp_users', []),
    data: safeParse('gesfinapp_data', {})
};

export function saveUsers() {
    localStorage.setItem('gesfinapp_users', JSON.stringify(state.users));
}

export function saveData() {
    localStorage.setItem('gesfinapp_data', JSON.stringify(state.data));
}
