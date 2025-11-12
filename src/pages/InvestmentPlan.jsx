import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import riseLogo from "../assets/RISE.png";

export default function InvestmentPlan() {
  const navigate = useNavigate();

  const plans = [
    {
      title: "שקט כלכלי",
      desc: '20% מניות, 70% אג"ח, 10% קרנות — סיכון נמוך',
      risk: "נמוך",
    },
    {
      title: "מבוססת צמיחה",
      desc: '45% מניות, 45% אג"ח, 10% קרנות — סיכון בינוני',
      risk: "בינוני",
    },
    {
      title: "קדימה דוחפים",
      desc: '75% מניות, 15% אג"ח, 10% קרנות — סיכון בינוני-גבוה',
      risk: "בינוני-גבוה",
    },
    {
      title: "הדרך אל העתיד",
      desc: '85% מניות, 5% אג"ח, 10% קרנות — סיכון גבוה',
      risk: "גבוה",
    },
  ];

  const selectPlan = (plan) => {
    const username = localStorage.getItem("user");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.username === username ? { ...u, plan } : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem(`plan_${username}`, JSON.stringify(plan));
    localStorage.setItem("plan", JSON.stringify(plan));
    navigate("/saving-type");
  };

  return (
    <Page>
      <Header>
        <h2>בחר את מסלול ההשקעה שלך</h2>
        <p>בחר את המסלול שמתאים לרמת הסיכון שלך</p>
      </Header>

      <Grid>
        {plans.map((p) => (
          <Card key={p.title} onClick={() => selectPlan(p)}>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <Risk>רמת סיכון: {p.risk}</Risk>
          </Card>
        ))}
      </Grid>

      {/* ✅ תמונה 1 בתחתית (RISE1) + וידאו מיוטיוב */}
      <FooterMedia>
        <img src={riseLogo} alt="RISE 1" />
        <div className="video">
          <iframe
            title="Investing Basics"
            src="https://www.youtube.com/embed?listType=search&list=investing%20basics"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </FooterMedia>
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
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
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
    margin-bottom: 12px;
  }
`;

const Risk = styled.p`
  font-weight: 600;
  color: #007094;
`;

const FooterMedia = styled.div`
  margin-top: 36px;
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 20px;
  align-items: center;

  img {
    width: 100%;
    border-radius: 12px;
    background: #fff;
    border: 1px solid #d0d7de;
    padding: 10px;
  }

  .video iframe {
    width: 100%;
    height: 315px;
    border: none;
    border-radius: 12px;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    .video iframe {
      height: 240px;
    }
  }
`;
