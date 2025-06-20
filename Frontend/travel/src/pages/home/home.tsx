import React, { useEffect, useState } from "react";
import { LeaderboardResponse } from "../../models/stats/leaderboardResponse";
import { getLeaderboardStats } from "../../api/leaderboardApi";
import Leaderboard from "../../components/leaderboard";
import car from "../../assets/travel_car.svg";
import { Button, notification } from "antd";
import { Link } from "react-router-dom";
import "./home.css";

export default function Home() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse[]>([]);

  useEffect(() => {
    const fetchLeaderboardStats = async () => {
      try {
        const data = await getLeaderboardStats();
        setLeaderboard(data);
      } catch (err: any) {
        notification.error({
          message: "Leaderboard Fetch Failed",
          description: err + ".",
        });
      }
    };
    fetchLeaderboardStats();

    const intervalId = setInterval(fetchLeaderboardStats, 30000); //30.000 ms = 30 s
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="homeContainer">
        <div>
          <div className="textMoto">
            Power up your
            <div className="textKeyword">adventures</div>
          </div>
          <p className="textParagraph">
            From weekend escapes to dream vacations, TravelPoints helps you turn
            every trip into an unforgettable experience. Earn rewards as you
            explore, discover hidden gems, and make every mile count. It's more
            than travel — it's your next great story waiting to unfold.
          </p>
          <Link to="attractions">
            <Button size={"large"} className="travelButton">
              Let's travel !
            </Button>
          </Link>
        </div>
        <img src={car} alt="car" className="carSvg" />
      </div>
      <div className="homeLeaderboard">
        <Leaderboard data={leaderboard} />
      </div>
    </>
  );
}
