import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Card, Form, Input, Button, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/user-api";
import { jwtDecode } from "jwt-decode";
import "./login.css";

export default function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  interface TokenPayload {
    sub: string;
    id: number;
    admin: boolean;
    exp: number;
  }

  const handleSubmit = async (values: any) => {
    try {
      const token = await loginUser(values);
      const decoded = jwtDecode<TokenPayload>(token);

      localStorage.setItem("token", token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isAdmin", decoded.admin.toString());

      notification.success({
        message: "Successfully logged in",
        description: "Welcome back!",
      });
      navigate("/");
    } catch (err: any) {
      notification.error({ message: "Login Failed", description: err + "." });
    }
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
