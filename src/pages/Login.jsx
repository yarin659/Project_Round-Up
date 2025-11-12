// ===== Logic =====
import { useState, useContext } from "react";
import { TransactionsContext } from "../context/TransactionsContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const navigate = useNavigate();
  const { syncUserFromStorage } = useContext(TransactionsContext);

  // --- Helper functions ---
  const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];
  const saveUsers = (users) => localStorage.setItem("users", JSON.stringify(users));

  const handleSubmit = () => {
    if (!username.trim() || !password.trim()) {
      alert("אנא מלא את כל השדות");
      return;
    }

    let users = getUsers();
    let existingUser = users.find((u) => u.username === username);

    // ---- REGISTER MODE ----
    if (isRegisterMode) {
      if (existingUser) {
        alert("שם המשתמש כבר קיים");
        return;
      }
      const newUser = { username, password, plan: null };
      users.push(newUser);
      saveUsers(users);
      alert("נרשמת בהצלחה! אפשר להתחבר כעת.");
      setIsRegisterMode(false);
      setUsername("");
      setPassword("");
      return;
    }

    // ---- LOGIN MODE ----
    if (!existingUser) {
      alert("משתמש לא נמצא, נא להירשם תחילה.");
      setIsRegisterMode(true);
      return;
    }

    if (existingUser.password !== password) {
      alert("סיסמה שגויה, נסה שוב.");
      return;
    }

    // ✅ Save logged-in user (without deleting others)
    localStorage.setItem("user", existingUser.username);
    // ✅ Immediately sync provider (same-tab update doesn't fire 'storage')
    if (typeof syncUserFromStorage === "function") {
      syncUserFromStorage();
    }

    // ✅ Check if user has existing plan
    const savedPlan = localStorage.getItem(`plan_${existingUser.username}`);
    if (savedPlan) {
      localStorage.setItem("plan", savedPlan);
      navigate("/dashboard");
    } else {
      localStorage.removeItem("plan");
      navigate("/investment-plan");
    }
  };

  return (
    <Page>
      <Card>
        <Title>Round-Up</Title>
        <Subtitle>
          {isRegisterMode ? "צור חשבון חדש" : "התחבר למערכת"}
        </Subtitle>

        <Form>
          <Label>שם משתמש</Label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Label>סיסמה</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button onClick={handleSubmit}>
            {isRegisterMode ? "הרשמה" : "התחברות"}
          </Button>

          <Switch onClick={() => setIsRegisterMode(!isRegisterMode)}>
            {isRegisterMode
              ? "כבר יש לך חשבון? התחבר"
              : "אין לך חשבון? הירשם"}
          </Switch>
        </Form>
      </Card>
    </Page>
  );
}

// ===== Styling =====
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f6f8;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 40px;
  width: 360px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 10px;
  color: #0081a8;
  font-weight: 700;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #555;
  margin-bottom: 30px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 6px;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 1rem;
  &:focus {
    border-color: #0081a8;
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 129, 168, 0.2);
  }
`;

const Button = styled.button`
  background: #0081a8;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: #007094;
  }
`;

const Switch = styled.p`
  text-align: center;
  color: #007094;
  margin-top: 20px;
  cursor: pointer;
  font-size: 0.95rem;
`;
