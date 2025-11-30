import { createContext, useState, useContext, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [goals, setGoals] = useState([]);

    // Load data from localStorage on mount
    useEffect(() => {
        const storedTransactions = localStorage.getItem('gesfin_transactions');
        const storedGoals = localStorage.getItem('gesfin_goals');

        if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
        if (storedGoals) setGoals(JSON.parse(storedGoals));
    }, []);

    // Save data whenever it changes
    useEffect(() => {
        localStorage.setItem('gesfin_transactions', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem('gesfin_goals', JSON.stringify(goals));
    }, [goals]);

    const addTransaction = (transaction) => {
        setTransactions(prev => [transaction, ...prev]);
    };

    const deleteTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    const addGoal = (goal) => {
        setGoals(prev => [...prev, goal]);
    };

    const deleteGoal = (id) => {
        setGoals(prev => prev.filter(g => g.id !== id));
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
