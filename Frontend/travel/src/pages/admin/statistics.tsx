import React, { useEffect, useState } from "react";
import {
  StatsResponse,
  TopStatsResponse,
} from "../../models/stats/statsResponse";
import { getStatistics, getTopStatistics } from "../../api/statisticsApi";
import {
  Card,
  Col,
  InputNumber,
  InputNumberProps,
  notification,
  Row,
} from "antd";
import { Column, Line } from "@ant-design/charts";
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
  const [topAttractions, setTopAttractions] = useState<
    { Name: string; Visits: number }[]
  >([]);
  const [topLocations, setTopLocations] = useState<
    { Name: string; Visits: number }[]
  >([]);
  const [limit, setLimit] = useState<number>(10);

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

    fetchTopStats(limit);
  }, []);

  useEffect(() => {
    fetchTopStats(limit);
  }, [limit]);

  const fetchTopStats = (limit: number) => {
    getTopStatistics(limit)
      .then((res: TopStatsResponse) => {
        const attractions = res.topAttractions.map((a) => ({
          Name: a.name,
          Visits: a.visitsCount,
        }));

        const locations = res.topLocations.map((l) => ({
          Name: l.name,
          Visits: l.visitsCount,
        }));

        setTopAttractions(attractions);
        setTopLocations(locations);
      })
      .catch((err) =>
        notification.error({
          message: "Failed to load top statistics. Please try again later.",
          description: String(err),
        })
      );
  };

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

  const topAttChartConfig = {
    data: topAttractions,
    xField: "Name",
    yField: "Visits",
  };

  const topLocChartConfig = {
    data: topLocations,
    xField: "Name",
    yField: "Visits",
  };

  return (
    <div className="statisticsPage">
      <Row className="statisticsRow" gutter={[30, 30]}>
        <Col xs={24} md={11}>
          <Card className="statisticsCard" title="Hourly Visits">
            <Line {...hourChartConfig} />
          </Card>
        </Col>
        <Col xs={24} md={11}>
          <Card className="statisticsCard" title="Monthly Visits">
            <Line {...monthChartConfig} />
          </Card>
        </Col>
      </Row>
      <Row className="statisticsRow" gutter={[30, 30]}>
        <Col xs={24} md={11}>
          <InputNumber
            min={1}
            max={10}
            size="large"
            defaultValue={10}
            addonBefore="Top limit: "
            className="statisticsLimit"
            onChange={(value) => {
              if (typeof value === "number") {
                setLimit(value);
              }
            }}
          />
        </Col>
        <Col xs={24} md={11} />
      </Row>
      <Row gutter={[30, 30]}>
        <Col xs={24} md={11}>
          <Card className="statisticsCard" title="Top Attractions">
            <Column {...topAttChartConfig} />
          </Card>
        </Col>
        <Col xs={24} md={11}>
          <Card className="statisticsCard" title="Top Locations">
            <Column {...topLocChartConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
