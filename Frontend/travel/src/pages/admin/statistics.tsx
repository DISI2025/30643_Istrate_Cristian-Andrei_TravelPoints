import React from "react";
import { Card, Col, Row } from "antd";
import "./statistics.css";

export default function Statistics() {
  return (
    <div className="statisticsPage">
      <Row className="statisticsRow" gutter={[30, 30]}>
        <Col xs={24} md={11}>
          <Card className="statisticsCard" title="Titlu Chart 1"></Card>
        </Col>
        <Col xs={24} md={11}>
          <Card className="statisticsCard" title="Titlu Chart 2"></Card>
        </Col>
      </Row>
      <Row className="statisticsRow" gutter={[30, 30]}>
        <Col xs={24} md={11}>
          <Card className="statisticsCard" title="Titlu Chart 3"></Card>
        </Col>
        <Col xs={24} md={11}>
          <Card className="statisticsCard" title="Titlu Chart 4"></Card>
        </Col>
      </Row>
    </div>
  );
}
