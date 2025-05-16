import React, {useEffect, useState} from "react";
import {Menu, Layout, MenuProps} from "antd";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {
    HomeOutlined,
    HeartOutlined,
    LoginOutlined,
    AppstoreOutlined,
} from "@ant-design/icons";
import "./navigation-bar.css";
import Notifications from "./notifiactions";

const {Header} = Layout;

const Navbar: React.FC = () => {
    const location = useLocation();
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const navigate = useNavigate();

    const [notificationCount, setNotificationCount] = useState(
        JSON.parse(sessionStorage.getItem("notifications") || "[]").length
    );

    const [selectedKey, setSelectedKey] = useState(location.pathname);

    const logoutUser = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("id");
        navigate("/login");
    };

    const updateCount = () => {
        const stored = JSON.parse(sessionStorage.getItem("notifications") || "[]");
        setNotificationCount(stored.length);
    };

    const removeNotification = (indexToRemove: number) => {
        const current = JSON.parse(sessionStorage.getItem("notifications") || "[]");
        const updated = current.filter((_: Record<string, any>, index: number) => index !== indexToRemove);
        sessionStorage.setItem("notifications", JSON.stringify(updated));
        setNotificationCount(updated.length);
        window.dispatchEvent(new Event("new-notification"));
    };

    useEffect(() => {
        updateCount();

        window.addEventListener("new-notification", updateCount);
        window.addEventListener("storage", updateCount);

        return () => {
            window.removeEventListener("new-notification", updateCount);
            window.removeEventListener("storage", updateCount);
        };
    }, []);

    useEffect(() => {
        setSelectedKey(location.pathname); // update selected key on route change
    }, [location.pathname]);

    const menuItems: MenuProps["items"] = [
        {
            key: "/attractions",
            icon: <HomeOutlined/>,
            label: (
                <NavLink to="/attractions" onClick={() => setSelectedKey("/attractions")}>
                    Attractions
                </NavLink>
            ),
        },
        ...(isAuthenticated
            ? [
                {
                    key: "/wishlist",
                    icon: <HeartOutlined/>,
                    label: (
                        <NavLink to="/wishlist" onClick={() => setSelectedKey("/wishlist")}>
                            Wishlist
                        </NavLink>
                    ),
                },
            ]
            : []),
        ...(isAdmin
            ? [
                {
                    key: "/admin",
                    icon: <AppstoreOutlined/>,
                    label: (
                        <NavLink to="/admin" onClick={() => setSelectedKey("/admin")}>
                            Admin
                        </NavLink>
                    ),
                },
            ]
            : []),
        ...(isAuthenticated
            ? [
                {
                    key: "/notifications",
                    label: (
                        <Notifications
                            notifications={JSON.parse(sessionStorage.getItem("notifications") || "[]")}
                            onRemove={removeNotification}
                            onOpen={() => setSelectedKey("/notifications")}
                        />
                    ),
                },
            ]
            : []),
        isAuthenticated
            ? {
                key: "/logout",
                icon: <LoginOutlined/>,
                label: "Log out",
                className: "loginItem",
                onClick: logoutUser,
            }
            : {
                key: "/login",
                icon: <LoginOutlined/>,
                label: (
                    <NavLink to="/login" onClick={() => setSelectedKey("/login")}>
                        Log in
                    </NavLink>
                ),
                className: "loginItem",
            },
    ];

    return (
        <Header className="customNavbar">
            <div className="logo">TravelPoints</div>
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[selectedKey]}
                className="menu"
                items={menuItems}
            />
        </Header>
    );
};

export default Navbar;
