import React, { useEffect, useState } from 'react';
import {List, Card, Button, message, Typography, Modal} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { getAllWishlists, deleteWishlist } from '../../api/wishlistApi';
import { WishlistResponse } from '../../models/wishlist/wishlistResponse';
import generalImage from "../../assets/colosseum.jpg"
import './wishlist.css';

const { Title, Text } = Typography;

export default function Wishlist() {
    const [wishlists, setWishlists] = useState<WishlistResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const userId = localStorage.getItem("id");

    const fetchWishlists = async () => {
        try {
            setLoading(true);
            const all = await getAllWishlists();
            const userWishlists = all.filter((item: WishlistResponse) => item.user.id === userId);
            setWishlists(userWishlists);
        } catch (error) {
            message.error("Failed to fetch wishlists");
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
                    fetchWishlists();
                } catch (error) {
                    message.error("Failed to delete wishlist item");
                }
            },
        });
    };


    useEffect(() => {
        fetchWishlists();
    }, []);

    return (
        <div className="wishlist-container">
            <Title level={2} className="wishlist-title">Your Wishlist</Title>
            <List
                loading={loading}
                grid={{ gutter: 16, column: 1 }}
                dataSource={wishlists}
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
                                    <Text strong>Description:</Text> <Text>{item.attraction.descriptionText}</Text><br/>
                                    <Text strong>Location:</Text> <Text>{item.attraction.location}</Text><br/>
                                    <Text strong>Price:</Text> <Text>${item.attraction.price}</Text>
                                </div>
                                <div className="wishlist-actions">
                                    <Button
                                        danger
                                        icon={<DeleteOutlined/>}
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>

                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
}
