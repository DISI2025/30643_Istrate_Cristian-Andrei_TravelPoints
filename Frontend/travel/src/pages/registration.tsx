import { Card, Form, Input, Button } from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function Registration() {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log("Form values:", values);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#F5EEDD",
      }}
    >
      <Card
        title={<span style={{ color: "#077A7D" }}>Register</span>}
        style={{ width: 400, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Name"
            style={{ color: "#06202B" }}
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            style={{ color: "#06202B" }}
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "The input is not valid E-mail!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            style={{ color: "#06202B" }}
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button color="cyan" variant="solid" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            Already have an account?{" "}
            <Link to="/login">
              <span style={{ color: "#077A7D" }}>Login</span>
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
