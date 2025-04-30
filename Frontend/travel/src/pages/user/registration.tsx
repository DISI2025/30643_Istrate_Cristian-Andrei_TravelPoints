import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Card, Form, Input, Button } from "antd";
import { registerUser } from "../../api/user-api";
import { Link } from "react-router-dom";
import "./registration.css";

export default function Registration() {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      const result = await registerUser(values);
      console.log("Registration success:", result);
    } catch (err: any) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="registrationPage">
      <Card
        className="registrationCard"
        title={<span className="registrationTitle">Register</span>}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Name"
            className="registrationForm"
            rules={[
              { required: true, message: "Please input your name!" },
              {
                validator: (_, value) => {
                  const nameRegex = /^[A-Z][a-zA-Z\s]*$/;
                  if (!value || nameRegex.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "Name must start with an uppercase letter and contain only letters and spaces!"
                  );
                },
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            className="registrationForm"
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
            className="registrationForm"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                validator: (_, value) => {
                  const passwordRegex = /^[A-Z][A-Za-z\d]{5,}$/;
                  const hasNumber = /\d/;
                  if (
                    !value ||
                    (passwordRegex.test(value) && hasNumber.test(value))
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "Password must start with an uppercase letter, be at least 6 characters, and contain at least one number!"
                  );
                },
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button color="cyan" variant="solid" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>

          <div className="registrationQuestion">
            Already have an account?{" "}
            <Link to="/login">
              <span className="registrationToLoginLink">Login</span>
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
