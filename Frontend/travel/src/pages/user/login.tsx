import { Card, Form, Input, Button } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./login.css";

export default function Login() {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log("Form values:", values); // Temporary: for testing before API integration
  };

  return (
    <div className="loginPage">
      <Card
        className="loginCard"
        title={<span className="loginTitle">Login</span>}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="email"
            label="Email"
            className="loginForm"
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
            className="loginForm"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button color="cyan" variant="solid" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>

          <div className="loginQuestion">
            Don't have an account?{" "}
            <Link to="/register">
              <span className="loginToRegistrationLink">Register</span>
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
