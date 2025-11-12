import { createContext, useState, useEffect, useCallback } from "react";

export const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
  // Identify current user
  const [username, setUsername] = useState(() => localStorage.getItem("user") || "defaultUser");

  // Dynamic localStorage keys
  const getTransactionsKey = (user) => `transactions_${user}`;
  const getSavingTypeKey = (user) => `savingType_${user}`;

  // Initial states
  const [transactions, setTransactions] = useState([]);
  const [savingType, setSavingType] = useState("agorot");

  // Sync user and saving type from localStorage
  const syncUserFromStorage = useCallback(() => {
    const currentUser = localStorage.getItem("user") || "defaultUser";
    setUsername((prev) => (prev !== currentUser ? currentUser : prev));
    try {
      const storedType = localStorage.getItem(getSavingTypeKey(currentUser));
      if (storedType) {
        // Always update state from localStorage (even if same user)
        setSavingType(storedType);
      }
    } catch (_err) {
      // ignore errors
    }
  }, []);

  // Event listeners for user changes across tabs or refocus
  useEffect(() => {
    const handleStorageChange = () => syncUserFromStorage();
    const handleFocus = () => syncUserFromStorage();
    const handleVisibility = () => document.visibilityState === "visible" && syncUserFromStorage();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [syncUserFromStorage]);

  // Load data when username changes
  useEffect(() => {
    if (!username) return;
    setTransactions([]);
    try {
      const storedTx = localStorage.getItem(getTransactionsKey(username));
      const storedType = localStorage.getItem(getSavingTypeKey(username));

      setTransactions(storedTx ? JSON.parse(storedTx) : []);
      setSavingType(storedType || "agorot");
    } catch (err) {
      console.error("Error loading transactions:", err);
      setTransactions([]);
    }
  }, [username]);

  // Save transactions
  useEffect(() => {
    if (!username) return;
    try {
      localStorage.setItem(getTransactionsKey(username), JSON.stringify(transactions));
    } catch (err) {
      console.error("Error saving transactions:", err);
    }
  }, [transactions, username]);

  // Save savingType
  useEffect(() => {
    if (!username) return;
    try {
      localStorage.setItem(getSavingTypeKey(username), savingType);
    } catch (err) {
      console.error("Error saving savingType:", err);
    }
  }, [savingType, username]);

  // ===== Round-up Calculation =====
  const calculateInvestPortion = (amount) => {
    let investPortion = 0;

    // Debug log (optional)
    // console.log("Saving Type:", savingType, "Amount:", amount);

    if (savingType === "agorot") {
      // Round up to next shekel
      const nextWhole = Math.ceil(amount);
      investPortion = nextWhole - amount;
    } else if (savingType === "shekels") {
      // Round up to next ten shekels
      const nextTen = Math.ceil(amount / 10) * 10;
      investPortion = nextTen - amount;
    }
    return +investPortion.toFixed(2);
  };

  // ===== Add transaction =====
  const addTransaction = (tx) => {
    const amount = parseFloat(tx.amount);
    const investPortion = calculateInvestPortion(amount);
    const totalAfterInvest = +(amount + investPortion).toFixed(2);

    const newTx = {
      ...tx,
      id: Date.now(),
      type: "expense",
      savingType,
      originalAmount: amount,
      investPortion,
      totalAfterInvest,
      amount: -Math.abs(totalAfterInvest),
    };

    setTransactions((prev) => [...prev, newTx]);
  };

  // ===== Delete transaction =====
  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        setTransactions,
        addTransaction,
        deleteTransaction,
        savingType,
        setSavingType,
        username,
        setUsername,
        syncUserFromStorage,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
