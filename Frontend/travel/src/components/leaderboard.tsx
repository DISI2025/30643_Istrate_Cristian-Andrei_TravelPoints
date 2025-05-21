import { LeaderboardProps } from "../models/stats/leaderboardResponse";
import { Avatar, Card, List } from "antd";
import { Link } from "react-router-dom";
import "./leaderboard.css";

export default function Leaderboard({ data }: LeaderboardProps) {
  return (
    <Card
      className="lbCard"
      title="Attractions Leaderboard"
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
          <Link to={`/attractions/${item.id}`} key={item.id}>
            <List.Item className="lbItem">
              <List.Item.Meta
                avatar={<Avatar className="lbAvatar">#{index + 1}</Avatar>}
                title={item.attractionName}
                description={`Score: ${item.score}`}
              />
            </List.Item>
          </Link>
        )}
      />
    </Card>
  );
}
