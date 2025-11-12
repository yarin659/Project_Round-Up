import { useState, useEffect } from "react";
import styled from "styled-components";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    name: "",
    target: "",
    monthlyDeposit: "",
    autoDate: "",
    deadline: "",
  });

  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("goals") || "[]");
    setGoals(stored);
  }, []);

  const saveGoals = (data) => {
    localStorage.setItem("goals", JSON.stringify(data));
  };

  // Add new goal
  const handleAddGoal = (e) => {
    e.preventDefault();
    const newGoal = {
      id: Date.now(),
      ...form,
      current: 0,
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    saveGoals(updated);
    setForm({
      name: "",
      target: "",
      monthlyDeposit: "",
      autoDate: "",
      deadline: "",
    });
  };

  // Auto deposit simulation
  useEffect(() => {
    const today = new Date().getDate();
    const updated = goals.map((g) => {
      if (Number(g.autoDate) === today) {
        const newCurr = Math.min(
          Number(g.current) + Number(g.monthlyDeposit),
          Number(g.target)
        );
        return { ...g, current: newCurr };
      }
      return g;
    });
    setGoals(updated);
    saveGoals(updated);
  }, []);

  return (
    <Wrapper>
      <Header>💰 Saving Goals</Header>

      <Form onSubmit={handleAddGoal}>
        <Input
          type="text"
          placeholder="Goal name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <Input
          type="number"
          placeholder="Target amount"
          value={form.target}
          onChange={(e) => setForm({ ...form, target: e.target.value })}
          required
        />
        <Input
          type="number"
          placeholder="Monthly deposit"
          value={form.monthlyDeposit}
          onChange={(e) =>
            setForm({ ...form, monthlyDeposit: e.target.value })
          }
          required
        />
        <Input
          type="number"
          placeholder="Auto date (1–31)"
          value={form.autoDate}
          onChange={(e) => setForm({ ...form, autoDate: e.target.value })}
          required
        />
        <Input
          type="date"
          placeholder="Select deadline"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          required
        />
        
        <AddButton type="submit">Add Goal</AddButton>
      </Form>

      <GoalList>
        {goals.map((g) => {
          const progress = Math.min(
            (Number(g.current) / Number(g.target)) * 100,
            100
          ).toFixed(1);

          return (
            <GoalCard key={g.id}>
              <GoalTitle>{g.name}</GoalTitle>

              <ProgressContainer>
                <ProgressFill style={{ width: `${progress}%` }} />
              </ProgressContainer>

              <GoalDetails>
                <span>
                  {g.current} / {g.target} ₪
                </span>
                <span>{progress}%</span>
              </GoalDetails>

              <GoalInfo>
                💸 {g.monthlyDeposit}₪ deposited on day {g.autoDate} each month
              </GoalInfo>

              <Deadline>
                ⏰ Deadline:{" "}
                {new Date(g.deadline).toLocaleDateString("he-IL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Deadline>
            </GoalCard>
          );
        })}
      </GoalList>
    </Wrapper>
  );
}

/* ===== Styled Components ===== */

const Wrapper = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Header = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 1.8rem;
  letter-spacing: 0.5px;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 0 8px rgba(0, 255, 100, 0.15);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  min-width: 150px;
  padding: 10px;
  border: 1px solid rgba(51, 163, 96, 1.5);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  outline: none;
  transition: border 0.3s;
  &::placeholder {
    color: rgba(0, 0, 0, 0.85);
    opacity: 1;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }

  &:not([value]):not(:focus)::before {
    content: attr(placeholder);
    color: rgba(0, 0, 0, 0.6);
  }

  &:focus::before {
    content: "";
  }
`;


const AddButton = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  color: #000;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
  font-size: 0.95rem;
  padding: 10px 18px;
  margin-left: auto;

  &:hover {
    opacity: 0.85;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

const GoalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GoalCard = styled.div`
  background: rgba(255, 255, 255, 0.06);
  padding: 1.2rem;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 255, 100, 0.1);
  transition: 0.3s;

  &:hover {
    box-shadow: 0 0 15px rgba(0, 255, 100, 0.25);
    transform: translateY(-3px);
  }
`;

const GoalTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ProgressContainer = styled.div`
  background: rgba(255, 255, 255, 0.15);
  height: 10px;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 8px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.accent};
  transition: width 0.6s ease;
`;

const GoalDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 0.9rem;
  opacity: 0.9;
`;

const GoalInfo = styled.small`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
`;

const Deadline = styled.small`
  display: block;
  margin-top: 6px;
  color: rgba(0, 132, 141, 0.8);
  font-size: 0.8rem;
`;
