import { Avatar, Card, List } from "antd";
import "./leaderboard.css";

export default function Leaderboard() {
  const data = [
    { name: "Colosseum", score: 3200 },
    { name: "Eiffel Tower", score: 2800 },
    { name: "Louvre Museum", score: 2600 },
    { name: "Statue of Liberty", score: 2400 },
    { name: "Big Ben", score: 2100 },
    { name: "Acropolis of Athens", score: 1950 },
    { name: "Brandenburg Gate", score: 1800 },
    { name: "Sagrada Familia", score: 1700 },
    { name: "Stonehenge", score: 1600 },
    { name: "Trevi Fountain", score: 1500 },
  ]; // just for testing

  return (
    <Card
      className="lbCard"
      title="Top 10 Attractions"
      styles={{
        header: { backgroundColor: "var(--deep-teal)", color: "white" },
        body: { backgroundColor: "var(--teal)" },
        title: { fontSize: 20, fontWeight: "bold" },
      }}
    >
      <List
        className="lbList"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item className="lbItem">
            <List.Item.Meta
              avatar={<Avatar className="lbAvatar">#{index + 1}</Avatar>}
              title={item.name}
              description={`Score: ${item.score}`}
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
