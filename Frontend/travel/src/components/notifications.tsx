import React from "react";
import {Dropdown, Badge} from "antd";
import {BellOutlined} from "@ant-design/icons";
import "./navigation-bar.css";

interface NotificationsDropdownProps {
    notifications: { message: string }[];
    onRemove: (index: number) => void;
    onOpen: () => void;
}

const Notifications: React.FC<NotificationsDropdownProps> = ({
                                                                 notifications,
                                                                 onRemove,
                                                                 onOpen,
                                                             }) => {
    const dropdownContent = (
        <div className="notificationDropdown">
            {notifications.length > 0 ? (
                notifications.map((msg, index) => (
                    <div className="notificationItem" key={index}>
                        <button
                            className="notificationClose"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(index);
                            }}
                        >
                            ×
                        </button>
                        <div className="notificationMessage">
                            {msg.message}
                            <div className="notificationDivider"/>
                        </div>
                    </div>
                ))
            ) : (
                <div className="notificationEmpty">No notifications</div>
            )}
        </div>
    );

    return (
        <Dropdown
            dropdownRender={() => dropdownContent}
            placement="bottom"
            trigger={["click"]}
            onOpenChange={(open) => {
                if (open) onOpen();
            }}
        >
            <div className="notificationsMenuItem">
                <Badge
                    count={notifications.length}
                    size="small"
                    offset={[100, 0]}
                    className="notificationBadge"
                >
                    <BellOutlined className="notificationBell"/>
                </Badge>
                <span className="notificationsText">Notifications</span>
            </div>
        </Dropdown>
    );
};

export default Notifications;
