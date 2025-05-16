import React from "react";
import { Card, Col, Row } from "antd";
import "./statistics.css";

export default function Statistics() {
  return (
    <div className="statisticsPage">
      <Row className="statisticsRow" gutter={[30, 30]}>
        <Col xs={24} md={11}>
          <Card className="statisticsCard" title="Hourly Visits"></Card>
        </Col>
        <Col xs={24} md={11}>
          <Card className="statisticsCard" title="Monthly Visits"></Card>
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
