// ===== Logic =====
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { TransactionsContext } from "../context/TransactionsContext";
import styled from "styled-components";

export default function SavingType() {
  const navigate = useNavigate();
  const { setSavingType, syncUserFromStorage, username } = useContext(TransactionsContext);

  const types = [
    {
      id: 1,
      title: "חיסכון באגורות (מסלול דיפולטיבי)",
      desc: "מעגל כל קנייה לסכום הקרוב שלם כלפי מעלה באגורות. לדוגמה: 17.20 → חיסכון 0.80₪.",
      value: "agorot",
    },
    {
      id: 2,
      title: "חיסכון בשקלים (מסלול משודרג)",
      desc: "מעגל כל קנייה לעשרות שקלים הקרובים כלפי מעלה. לדוגמה: 17.20 → חיסכון עד 20₪.",
      value: "shekels",
    },
  ];

  const selectType = (type) => {
    if (typeof setSavingType === "function") {
      setSavingType(type);
    }

    // שמירה גם ב-localStorage תחת המשתמש הפעיל
    if (username) {
      localStorage.setItem(`savingType_${username}`, type);
    }

    // הפעלת סנכרון כדי שכל הטאבים/קומפוננטות יתעדכנו
    if (typeof syncUserFromStorage === "function") {
      syncUserFromStorage();
    }

    navigate("/dashboard");
  };

  return (
    <Page>
      <Header>
        <h2>בחר את סוג החיסכון שלך</h2>
        <p>בחר את השיטה שבה תבוצע העיגול של סכום הקנייה שלך</p>
      </Header>

      <Grid>
        {types.map((t) => (
          <Card key={t.id} onClick={() => selectType(t.value)}>
            <h3>{t.title}</h3>
            <p>{t.desc}</p>
          </Card>
        ))}
      </Grid>
    </Page>
  );
}

// ===== Styling =====
const Page = styled.div`
  min-height: 100vh;
  background: #f4f6f8;
  padding: 60px 10%;
  color: #222;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;

  h2 {
    color: #0081a8;
    margin-bottom: 8px;
  }

  p {
    color: #555;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #d0d7de;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: 0.25s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border-color: #0081a8;
  }

  h3 {
    color: #0081a8;
    margin-bottom: 10px;
  }

  p {
    color: #333;
  }
`;
