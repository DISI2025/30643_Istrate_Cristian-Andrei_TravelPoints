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
        renderItem={(item, index) => {
          const backgroundColors = ["#fffbe6", "#f0f5ff", "#fff0f6"];
          const medalEmojis = ["🥇", "🥈", "🥉"];
          const isTop3 = index < 3;
          return (
            <Link to={`/attractions/${item.id}`} key={item.id}>
              <List.Item
                className="lbItem"
                style={{
                  backgroundColor: isTop3
                    ? backgroundColors[index]
                    : "transparent",
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      className="lbAvatar"
                      style={{
                        backgroundColor: isTop3 ? "#faad14" : "#1890ff",
                        fontWeight: "bold",
                      }}
                    >
                      {isTop3 ? medalEmojis[index] : `#${index + 1}`}
                    </Avatar>
                  }
                  title={
                    <span
                      style={{
                        fontWeight: isTop3 ? "bold" : "normal",
                      }}
                    >
                      {item.attractionName}
                    </span>
                  }
                  description={`Score: ${item.score}`}
                />
              </List.Item>
            </Link>
          );
        }}
      />
    </Card>
  );
}
