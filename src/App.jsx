import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { theme } from "./styles/theme";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";
import Insights from "./pages/Insights";
import Login from "./pages/Login";
import InvestmentPlan from "./pages/InvestmentPlan";
import SavingType from "./pages/SavingType";
import { TransactionsContext } from "./context/TransactionsContext";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: "Inter", sans-serif;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export default function App() {
  const { username } = useContext(TransactionsContext) || {};
  const isLoggedIn = !!username && username !== "defaultUser";
  const location = useLocation();

  // 👇 אם נכנסים לכתובת הראשית "/" – נשלח תמיד לעמוד התחברות
  if (location.pathname === "/") {
    return <Navigate to="/login" replace />;
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {/* נציג את ה־NavBar רק אם המשתמש מחובר */}
      {isLoggedIn && <NavBar />}

      <Routes>
          {/* עמוד התחברות */}
          <Route path="/login" element={<Login />} />

          {/* עמוד בחירת מסלול השקעה */}
          <Route
            path="/investment-plan"
            element={
              isLoggedIn ? <InvestmentPlan /> : <Navigate to="/login" replace />
            }
          />

          {/* עמוד בחירת סוג חיסכון */}
          <Route
            path="/saving-type"
            element={
              isLoggedIn ? <SavingType /> : <Navigate to="/login" replace />
            }
          />

          {/* דשבורד – רק למשתמשים מחוברים */}
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />

          {/* עמודים נוספים */}
          <Route
            path="/transactions"
            element={
              isLoggedIn ? <Transactions /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/goals"
            element={
              isLoggedIn ? <Goals /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/insights"
            element={
              isLoggedIn ? <Insights /> : <Navigate to="/login" replace />
            }
          />

          {/* כל נתיב לא קיים – חזרה ל־login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
 