import React, { useEffect, useState } from 'react';
import { List, Card, Button, message, Typography, Modal, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { getAllWishlists, deleteWishlist } from '../../api/wishlistApi';
import { getVisitsOfUser } from '../../api/visitApi';
import { WishlistResponse } from '../../models/wishlist/wishlistResponse';
import { VisitResponse } from '../../models/visit/visitResponse';
import generalImage from "../../assets/colosseum.jpg";
import './wishlist.css';

const { Title, Text } = Typography;
const { Option } = Select;

type ItemType = WishlistResponse | VisitResponse;

export default function Wishlist() {
    const [mode, setMode] = useState<'wishlist' | 'visit'>('wishlist');
    const [data, setData] = useState<ItemType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const userId = JSON.parse(localStorage.getItem("id") || "{}");

    const fetchData = async () => {
        try {
            setLoading(true);
            if (mode === 'wishlist') {
                const all = await getAllWishlists();
                const userWishlists = all.filter((item: WishlistResponse) => item.user.id === userId);
                setData(userWishlists);
            } else {
                const userVisits = await getVisitsOfUser(userId);
                setData(userVisits);
            }
        } catch (error) {
            message.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Are you sure?',
            content: 'Do you really want to remove this item from your wishlist?',
            okText: 'Yes, delete it',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await deleteWishlist(id);
                    message.success("Wishlist item deleted");
                    fetchData();
                } catch (error) {
                    message.error("Failed to delete wishlist item");
                }
            },
        });
    };

    useEffect(() => {
        fetchData();
    }, [mode]);

    return (
        <div className="wishlist-container">
            <Title level={2} className="wishlist-title">Your {mode === 'wishlist' ? 'Wishlist' : 'Visits'}</Title>

            <div className="filters-container">
                <Select
                    defaultValue="wishlist"
                    onChange={(value) => setMode(value as 'wishlist' | 'visit')}
                    style={{ width: 200, marginBottom: 24 }}
                >
                    <Option value="wishlist">Wishlist</Option>
                    <Option value="visit">Visits</Option>
                </Select>
            </div>

            <List
                loading={loading}
                grid={{ gutter: 16, column: 1 }}
                dataSource={data}
                renderItem={item => (
                    <List.Item className="wishlist-item">
                        <Card className="wishlist-card">
                            <div className="wishlist-content">
                                <img
                                    src={generalImage}
                                    alt={item.attraction.name}
                                    className="wishlist-image"
                                />
                                <div className="wishlist-text">
                                    <Title level={4}>{item.attraction.name}</Title>

                                    {"visitTimestamp" in item && (
                                        <>
                                            <Text strong>Visited On:</Text>{" "}
                                            <Text>
                                                {new Date(item.visitTimestamp as string).toLocaleDateString()}
                                            </Text><br />
                                        </>
                                    )}

                                    <Text strong>Location:</Text>{" "}
                                    <Text>{item.attraction.location}</Text><br />

                                    <Text strong>Price:</Text>{" "}
                                    <Text>${item.attraction.price}</Text>
                                </div>

                                {"addedAt" in item && (
                                    <div className="wishlist-actions">
                                        <Button
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
}
