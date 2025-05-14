import React from "react";
import { Menu, Layout, Button, MenuProps } from "antd";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  HeartOutlined,
  LoginOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import "./navigation-bar.css";
import {logoutUser} from "../api/userApi";

const { Header } = Layout;

const Navbar: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const navigate = useNavigate();

    const menuItems: MenuProps["items"] = [
    {
      key: "/attractions",
      icon: <HomeOutlined />,
      label: <NavLink to="/attractions">Attractions</NavLink>,
    },
    ...(isAuthenticated
      ? [
          {
            key: "/wishlist",
            icon: <HeartOutlined />,
            label: <NavLink to="/wishlist">Wishlist</NavLink>,
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            key: "/admin",
            icon: <AppstoreOutlined />,
            label: <NavLink to="/admin">Admin</NavLink>,
          },
        ]
      : []),
    isAuthenticated
      ? {
          key: "/logout",
          icon: <LoginOutlined />,
          label: "Log out",
          className: "loginItem",
            onClick: () => {
                logoutUser();
                navigate("/login")
            }, 
        }
      : {
          key: "/login",
          icon: <LoginOutlined />,
          label: <NavLink to="/login">Log in</NavLink>,
          className: "loginItem",
        },
  ];

  return (
    <Header className="customNavbar">
      <div className="logo">TravelPoints</div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        className="menu"
        items={menuItems}
      />
    </Header>
  );
};

export default Navbar;
