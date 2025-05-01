import React from "react";
import { Menu, Layout } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import {
    HomeOutlined,
    HeartOutlined,
    LoginOutlined,
    AppstoreOutlined
} from "@ant-design/icons";
import "./navigation-bar.css";

const { Header } = Layout;

const Navbar: React.FC = () => {
    const location = useLocation();

    return (
        <Header className="customNavbar">
            <div className="logo">TravelPoints</div>
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[location.pathname]}
                className="menu"
            >
                <Menu.Item key="/attractions" icon={<HomeOutlined />}>
                    <NavLink to="/attractions">Attractions</NavLink>
                </Menu.Item>
                <Menu.Item key="/wishlist" icon={<HeartOutlined />}>
                    <NavLink to="/wishlist">Wishlist</NavLink>
                </Menu.Item>
                <Menu.Item key="/admin" icon={<AppstoreOutlined />}>
                    <NavLink to="/admin">Admin</NavLink>
                </Menu.Item>
                <div className="spacer" />
                <Menu.Item key="/login" icon={<LoginOutlined />}>
                    <NavLink to="/login">Sign Out</NavLink>
                </Menu.Item>
            </Menu>
        </Header>
    );
};

export default Navbar;
