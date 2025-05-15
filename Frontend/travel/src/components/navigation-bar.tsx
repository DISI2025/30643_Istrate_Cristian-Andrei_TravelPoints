import React, {useEffect, useState} from "react";
import {Menu, Layout, MenuProps, Dropdown   } from "antd";
import {Badge} from "antd";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {
    HomeOutlined,
    HeartOutlined,
    LoginOutlined,
    AppstoreOutlined, BellOutlined,
} from "@ant-design/icons";
import "./navigation-bar.css";

const {Header} = Layout;

const Navbar: React.FC = () => {
    const location = useLocation();
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(
        JSON.parse(sessionStorage.getItem("notifications") || "[]").length
    );

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
        const updated = current.filter((_ : Record<string, any>, index: number) => index !== indexToRemove);
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

    const menuItems: MenuProps["items"] = [
        {
            key: "/attractions",
            icon: <HomeOutlined/>,
            label: <NavLink to="/attractions">Attractions</NavLink>,
        },
        ...(isAuthenticated
            ? [
                {
                    key: "/wishlist",
                    icon: <HeartOutlined/>,
                    label: <NavLink to="/wishlist">Wishlist</NavLink>,
                },
            ]
            : []),
        ...(isAdmin
            ? [
                {
                    key: "/admin",
                    icon: <AppstoreOutlined/>,
                    label: <NavLink to="/admin">Admin</NavLink>,
                },
            ]
            : []),
        ...(isAuthenticated
            ? [
                {
                    key: "/notifications",
                    label: (
                        <Dropdown
                            dropdownRender={() => (
                                <div className="notificationDropdown">
                                    {notificationCount > 0 ? (
                                        JSON.parse(sessionStorage.getItem("notifications") || "[]").map(
                                            (msg: any, index: number) => (
                                                <div className="notificationItem">
                                                    <button
                                                        className="notificationClose"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeNotification(index);
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                    <div className="notificationMessage">
                                                        {msg.message}
                                                        <div className="notificationDivider"/>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <div className="notificationEmpty">No notifications</div>
                                    )}
                                </div>
                            )}
                            placement="bottom"
                            trigger={["click"]}
                        >
                            <div className="notificationsMenuItem">
                                <Badge
                                    count={notificationCount}
                                    size="small"
                                    offset={[10, -4]}
                                    className="notificationBadge"
                                >
                                    <BellOutlined className="notificationBell" />
                                </Badge>
                                <span className="notificationsText">Notifications</span>
                            </div>
                        </Dropdown>
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
