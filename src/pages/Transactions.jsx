// ===== Logic =====
import { useState, useContext, useMemo } from "react";
import styled from "styled-components";
import AddTransactionModal from "../components/AddTransactionModal.jsx";
import { TransactionsContext } from "../context/TransactionsContext";
import { X } from "lucide-react";

export default function Transactions() {
  const { transactions, addTransaction, deleteTransaction, savingType } = useContext(TransactionsContext);
  const [open, setOpen] = useState(false);
  const handleDelete = (id) => deleteTransaction(id);

  const monthlyInvestments = useMemo(() => {
    const grouped = {};
    transactions.forEach((t) => {
      if (t.type === "expense" && t.investPortion > 0) {
        const month = new Date(t.date).toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        grouped[month] = (grouped[month] || 0) + t.investPortion;
      }
    });
    return grouped;
  }, [transactions]);

  return (
    <Wrapper>
      <Header>
        <h1>
          Expenses ({savingType === "agorot" ? "אגורות" : "עשרות שקלים"})
        </h1>
        <AddButton onClick={() => setOpen(true)}>+ Add Expense</AddButton>
      </Header>

      <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount Before Invest</th>
            <th>Invested</th>
            <th>Total After Invest</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.date}</td>
              <td>{t.desc}</td>
              <td>{t.category}</td>
              <td>{t.originalAmount?.toFixed(2)} ₪</td>
              <td>{t.investPortion?.toFixed(2)} ₪</td>
              <td>{t.totalAfterInvest?.toFixed(2)} ₪</td>
              <td>
                <DeleteButton onClick={() => handleDelete(t.id)}>
                  <X size={18} />
                </DeleteButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <SummarySection>
        <h2>Monthly Investment Summary</h2>
        <SummaryTable>
          <thead>
            <tr>
              <th>Month</th>
              <th>Total Invested</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(monthlyInvestments).map(([month, total]) => (
              <tr key={month}>
                <td>{month}</td>
                <td>{total.toFixed(2)} ₪</td>
              </tr>
            ))}
          </tbody>
        </SummaryTable>
      </SummarySection>

      {open && (
        <AddTransactionModal
          onClose={() => setOpen(false)}
          onSave={addTransaction}
        />
      )}
    </Wrapper>
  );
}

// ===== Styling =====
const Wrapper = styled.section`
  padding: 32px;
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const AddButton = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  border: none;
  color: #fff;
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 40px;

  th, td {
    text-align: left;
    padding: 14px 18px;
  }

  th {
    background: #f0f2f3;
    color: #555;
    font-size: 0.9rem;
  }
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: #888;
  cursor: pointer;
  &:hover {
    color: #ff4d4d;
  }
`;

const SummarySection = styled.div`
  margin-top: 40px;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 20px;
`;

const SummaryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td { padding: 10px 14px; text-align: left; }
  th { background: #f5f7f8; color: #444; }
`;


//check