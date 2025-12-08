import { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    setDoc,
    onSnapshot,
    query,
    orderBy
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

// Category Definitions with Colors and Icons
export const CATEGORY_STYLES = {
    'Comida': { color: '#FF6384', icon: 'fa-utensils' },
    'Transporte': { color: '#36A2EB', icon: 'fa-bus' },
    'Vivienda': { color: '#FFCE56', icon: 'fa-home' },
    'Entretenimiento': { color: '#4BC0C0', icon: 'fa-gamepad' },
    'Salud': { color: '#9966FF', icon: 'fa-heartbeat' },
    'Salario': { color: '#2ecc71', icon: 'fa-money-bill-wave' },
    'Educación': { color: '#FF9F40', icon: 'fa-graduation-cap' },
    'Servicios': { color: '#0d9488', icon: 'fa-bolt' },
    'Ahorro': { color: '#27ae60', icon: 'fa-piggy-bank' },
    'Inversión': { color: '#8e44ad', icon: 'fa-chart-line' },
    'Ropa': { color: '#db2777', icon: 'fa-tshirt' },
    'Mascotas': { color: '#d97706', icon: 'fa-paw' },
    'Viajes': { color: '#0284c7', icon: 'fa-plane' },
    'Deportes': { color: '#ea580c', icon: 'fa-dumbbell' },
    'Tecnología': { color: '#4f46e5', icon: 'fa-laptop' },
    'Otros': { color: '#95a5a6', icon: 'fa-box' }
};

export const getCategoryStyle = (categoryName, allStyles = CATEGORY_STYLES) => {
    return allStyles[categoryName] || { color: '#cbd5e1', icon: 'fa-circle-question' }; // Default style
};

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [goals, setGoals] = useState([]);
    const [customCategories, setCustomCategories] = useState({});
    const { user } = useAuth();

    // Combined categories state (memoized to avoid infinite loops if used in dependencies)
    // We export a helper to get styles, but components might need the list of all available categories
    const allCategories = { ...CATEGORY_STYLES, ...customCategories };

    // Load data from Firestore when user logs in
    useEffect(() => {
        if (!user) {
            setTransactions([]);
            setGoals([]);
            setCustomCategories({});
            return;
        }

        // Real-time listener for transactions
        const qTransactions = query(
            collection(db, `users/${user.uid}/transactions`),
            orderBy('date', 'desc')
        );

        const unsubscribeTransactions = onSnapshot(qTransactions, (snapshot) => {
            const transData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTransactions(transData);
        });

        // Real-time listener for goals
        const qGoals = query(collection(db, `users/${user.uid}/goals`));

        const unsubscribeGoals = onSnapshot(qGoals, (snapshot) => {
            const goalsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setGoals(goalsData);
        });

        // Real-time listener for custom categories
        const qCategories = query(collection(db, `users/${user.uid}/categories`));

        const unsubscribeCategories = onSnapshot(qCategories, (snapshot) => {
            const catsData = {};
            snapshot.docs.forEach(doc => {
                catsData[doc.id] = doc.data(); // doc.id is the category name
            });
            setCustomCategories(catsData);
        });

        return () => {
            unsubscribeTransactions();
            unsubscribeGoals();
            unsubscribeCategories();
        };
    }, [user]);

    const addTransaction = async (transaction) => {
        if (!user) return;
        try {
            // Remove ID if present, let Firestore generate it
            const { id, ...data } = transaction;
            await addDoc(collection(db, `users/${user.uid}/transactions`), data);
        } catch (error) {
            console.error("Error adding transaction: ", error);
        }
    };

    const deleteTransaction = async (id) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, `users/${user.uid}/transactions`, id));
        } catch (error) {
            console.error("Error deleting transaction: ", error);
        }
    };

    const addGoal = async (goal) => {
        if (!user) return;
        try {
            const { id, ...data } = goal;
            await addDoc(collection(db, `users/${user.uid}/goals`), data);
        } catch (error) {
            console.error("Error adding goal: ", error);
        }
    };

    const deleteGoal = async (id) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, `users/${user.uid}/goals`, id));
        } catch (error) {
            console.error("Error deleting goal: ", error);
        }
    };

    const addCategoryMetadata = async (name, icon, color) => {
        if (!user) return;
        try {
            // Use the category name as the document ID to prevent duplicates
            await setDoc(doc(db, `users/${user.uid}/categories`, name), {
                icon,
                color
            });
        } catch (error) {
            console.error("Error adding category metadata: ", error);
        }
    };

    const calculateBalance = () => {
        return transactions.reduce((acc, curr) => {
            return curr.type === 'income' ? acc + Number(curr.amount) : acc - Number(curr.amount);
        }, 0);
    };

    const calculateIncome = () => {
        return transactions
            .filter(t => t.type === 'income')
            .reduce((acc, curr) => acc + Number(curr.amount), 0);
    };

    const calculateExpense = () => {
        return transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => acc + Number(curr.amount), 0);
    };

    return (
        <DataContext.Provider value={{
            transactions,
            goals,
            allCategories,
            addTransaction,
            deleteTransaction,
            addGoal,
            deleteGoal,
            addCategoryMetadata,
            calculateBalance,
            calculateIncome,
            calculateExpense
        }}>
            {children}
        </DataContext.Provider>
    );
};
