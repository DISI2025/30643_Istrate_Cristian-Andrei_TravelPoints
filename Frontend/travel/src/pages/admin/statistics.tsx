import React, { useEffect, useState } from "react";
import { StatsResponse } from "../../models/stats/statsResponse";
import { getStatistics } from "../../api/statisticsApi";
import { Card, Col, notification, Row } from "antd";
import { Column } from "@ant-design/charts";
import "./statistics.css";

const months = [
  "Ian",
  "Feb",
  "Mar",
  "Apr",
  "Mai",
  "Iun",
  "Iul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function Statistics() {
  const [hourData, setHourData] = useState<{ Hour: string; Visits: number }[]>(
    []
  );
  const [monthData, setMonthData] = useState<
    { Month: string; Visits: number }[]
  >([]);

  useEffect(() => {
    getStatistics()
      .then((res: StatsResponse) => {
        const hours = res.visitsByHour.map((count, index) => ({
          Hour: index.toString().padStart(2, "0"),
          Visits: count,
        }));

        const monthsTransformed = res.visitsByMonth.map((count, index) => ({
          Month: months[index],
          Visits: count,
        }));

        setHourData(hours);
        setMonthData(monthsTransformed);
      })
      .catch((err) =>
        notification.error({
          message: "Failed to load statistics. Please try again later.",
          description: String(err),
        })
      );
  }, []);

  const hourChartConfig = {
    data: hourData,
    xField: "Hour",
    yField: "Visits",
  };

  const monthChartConfig = {
    data: monthData,
    xField: "Month",
    yField: "Visits",
  };

  return (
    <div className="statisticsPage">
      <Row className="statisticsRow" gutter={[30, 30]}>
        <Col xs={24} md={11}>
          <Card className="statisticsCard" title="Hourly Visits">
            <Column {...hourChartConfig} />
          </Card>
        </Col>
        <Col xs={24} md={11}>
          <Card className="statisticsCard" title="Monthly Visits">
            <Column {...monthChartConfig} />
          </Card>
        </Col>
      </Row>
      <Row className="statisticsRow" gutter={[30, 30]}>
        <Col xs={24} md={11}>
          <Card className="statisticsCard" title="Top Attractions"></Card>
        </Col>
        <Col xs={24} md={11}>
          <Card className="statisticsCard" title="Top Locations"></Card>
        </Col>
      </Row>
    </div>
  );
}
