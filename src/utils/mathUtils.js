/**
 * Agrupa las transacciones por mes y año.
 * Retorna un objeto donde las claves son "YYYY-MM" y los valores son arrays de transacciones.
 */
export const groupTransactionsByMonth = (transactions) => {
    return transactions.reduce((acc, transaction) => {
        // Use string slicing YYYY-MM to avoid timezone issues with new Date()
        // transaction.date is expected to be "YYYY-MM-DD"
        if (!transaction.date) return acc;

        const key = transaction.date.substring(0, 7); // "2025-12"

        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(transaction);
        return acc;
    }, {});
};

/**
 * Calcula el total de ingresos o gastos para un array de transacciones dado.
 */
export const calculateTotalByType = (transactions, type) => {
    return transactions
        .filter(t => t.type === type)
        .reduce((acc, t) => acc + Number(t.amount), 0);
};

/**
 * Calcula la variación porcentual entre dos valores.
 * Retorna un número (porcentaje) o null si el valor previo es 0.
 */
export const calculateMonthlyVariation = (currentValue, previousValue) => {
    if (previousValue === 0) return null; // Evitar división por cero
    return ((currentValue - previousValue) / previousValue) * 100;
};

/**
 * Obtiene los datos del mes actual y del mes anterior.
 * Retorna objetos con totales de income y expense.
 */
export const getCurrentAndPreviousMonthData = (transactions) => {
    const grouped = groupTransactionsByMonth(transactions);

    const now = new Date();
    const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Calcular mes anterior
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

    const currentTrans = grouped[currentKey] || [];
    const prevTrans = grouped[prevKey] || [];

    return {
        current: {
            income: calculateTotalByType(currentTrans, 'income'),
            expense: calculateTotalByType(currentTrans, 'expense') + calculateTotalByType(currentTrans, 'saving')
        },
        previous: {
            income: calculateTotalByType(prevTrans, 'income'),
            expense: calculateTotalByType(prevTrans, 'expense') + calculateTotalByType(prevTrans, 'saving')
        }
    };
};

/**
 * Calcula el ahorro promedio mensual basado en todo el historial.
 * Ahorro = Ingresos - Gastos
 */
export const calculateAverageMonthlySavings = (transactions) => {
    const grouped = groupTransactionsByMonth(transactions);
    const months = Object.keys(grouped);

    if (months.length === 0) return 0;

    const totalSavings = months.reduce((acc, monthKey) => {
        const monthTrans = grouped[monthKey];
        const income = calculateTotalByType(monthTrans, 'income');
        const expense = calculateTotalByType(monthTrans, 'expense') + calculateTotalByType(monthTrans, 'saving');
        return acc + (income - expense);
    }, 0);

    return totalSavings / months.length;
};

/**
 * Proyecta la fecha estimada para alcanzar una meta.
 * Retorna la fecha estimada o null si no es posible (ahorro <= 0).
 */
export const projectGoalCompletion = (targetAmount, currentAmount, monthlySavings) => {
    if (monthlySavings <= 0) return null;

    const remaining = targetAmount - currentAmount;
    if (remaining <= 0) return new Date(); // Ya completada

    const monthsNeeded = remaining / monthlySavings;
    const today = new Date();
    const estimatedDate = new Date(today.setMonth(today.getMonth() + Math.ceil(monthsNeeded)));

    return estimatedDate;
};
