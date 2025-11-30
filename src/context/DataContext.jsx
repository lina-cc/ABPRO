import { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [goals, setGoals] = useState([]);
    const { user } = useAuth();

    // Load data from Firestore when user logs in
    useEffect(() => {
        if (!user) {
            setTransactions([]);
            setGoals([]);
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

        return () => {
            unsubscribeTransactions();
            unsubscribeGoals();
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
            addTransaction,
            deleteTransaction,
            addGoal,
            deleteGoal,
            calculateBalance,
            calculateIncome,
            calculateExpense
        }}>
            {children}
        </DataContext.Provider>
    );
};
