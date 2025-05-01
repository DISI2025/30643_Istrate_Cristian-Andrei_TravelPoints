import React, { useEffect, useState } from 'react';
import { List, Card, Button, message, Typography, Modal, Select, Slider, Input } from 'antd';
import {DeleteOutlined, DollarOutlined} from '@ant-design/icons';
import { getAllWishlists, deleteWishlist } from '../../api/wishlistApi';
import { WishlistResponse } from '../../models/wishlist/wishlistResponse';
import generalImage from "../../assets/colosseum.jpg";
import './wishlist.css';

const { Title, Text } = Typography;
const { Option } = Select;

export default function Wishlist() {
    const [wishlists, setWishlists] = useState<WishlistResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filters, setFilters] = useState({
        name: "",
        location: "",
        priceRange: [0, 100],
    });
    const [locations, setLocations] = useState<string[]>([]);
    const [shouldFetch, setShouldFetch] = useState<boolean>(true);

    const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;

    const fetchWishlists = async () => {
        try {
            setLoading(true);
            const all = await getAllWishlists();
            const userWishlists = all.filter((item: WishlistResponse) => item.user.id === userId);
            const filteredWishlists = userWishlists.filter((item: WishlistResponse) => {
                const matchName = item.attraction.name.toLowerCase().includes(filters.name.toLowerCase());
                const matchLocation = filters.location ? item.attraction.location === filters.location : true;
                const matchPrice = item.attraction.price >= filters.priceRange[0] && item.attraction.price <= filters.priceRange[1];
                return matchName && matchLocation && matchPrice;
            });
            setWishlists(filteredWishlists);
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

    const handleFilterChange = (updatedFilters: any) => {
        setFilters(prev => ({ ...prev, ...updatedFilters }));
    };

    const handleApplyFilters = () => {
        setShouldFetch(true);
    };

    useEffect(() => {
        if (shouldFetch) {
            fetchWishlists();
            setShouldFetch(false);
        }
    }, [shouldFetch]);

    useEffect(() => {
        const fetchLocations = async () => {
            setLocations(["Paris", "Rome", "London", "New York"]);
        };

        fetchLocations();
    }, []);

    return (
        <div className="wishlist-container">
            <Title level={2} className="wishlist-title">Your Wishlist</Title>

            <div className="filters-container">
                <Input
                    placeholder="Attraction Name"
                    value={filters.name}
                    onChange={e => handleFilterChange({ name: e.target.value })}
                    className="attractionInput"
                />

                <Select
                    placeholder="Select Location"
                    allowClear
                    className="attractionSelect"
                    value={filters.location || undefined}
                    onChange={value => handleFilterChange({ location: value })}
                >
                    {locations.map(loc => (
                        <Option key={loc} value={loc}>
                            {loc}
                        </Option>
                    ))}
                </Select>
                <DollarOutlined className="price-icon" />
                <div className="priceRangeContainer">
                    <Slider
                        range
                        min={0}
                        max={100}
                        value={filters.priceRange}
                        onChange={value => handleFilterChange({ priceRange: value })}
                    />
                </div>

                <Button type="primary" onClick={handleApplyFilters}>
                    Apply Filters
                </Button>
            </div>

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
                                    <Text strong>Description:</Text> <Text>{item.attraction.descriptionText}</Text><br />
                                    <Text strong>Location:</Text> <Text>{item.attraction.location}</Text><br />
                                    <Text strong>Price:</Text> <Text>${item.attraction.price}</Text>
                                </div>
                                <div className="wishlist-actions">
                                    <Button
                                        danger
                                        icon={<DeleteOutlined />}
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
