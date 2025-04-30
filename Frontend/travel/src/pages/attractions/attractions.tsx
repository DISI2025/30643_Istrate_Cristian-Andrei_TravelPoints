import { useEffect, useState } from "react";
import axios from "axios";
import {Card, Button, Row, Select, Slider, Input, Pagination, message,
} from "antd";
import { Link } from "react-router-dom";
import "./attractions.css";
import generalImage from "../../assets/colosseum.jpg";

const { Option } = Select;

type Attraction = {
    id: number;
    name: string;
    location: string;
    category: string;
    price: number;
};

export default function Attractions() {
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [filters, setFilters] = useState({
        name: "",
        location: "",
        category: "",
        priceRange: [0, 100],
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalAttractions, setTotalAttractions] = useState(0);
    const [showFilters, setShowFilters] = useState(false);


    const fetchAllAttractions = async () => {
        try {
            const res = await axios.get("http://localhost:8080/attraction/all");
            if (res.data) {
                const allAttractions: Attraction[] = res.data;
                const uniqueLocations = Array.from(new Set(allAttractions.map(a => a.location)));
                const uniqueCategories = Array.from(new Set(allAttractions.map(a => a.category)));
                setLocations(uniqueLocations);
                setCategories(uniqueCategories);
            }
        } catch (err) {
            message.error("Failed to load filter data.");
        }
    };

    const fetchAttractions = async (page: number = 1) => {
        try {
            const res = await axios.get("http://localhost:8080/attraction/getAllPageable", {
                params: {
                    pageNumber: page - 1,
                    pageSize: 4,
                },
            });

            if (res.data && res.data.content) {
                setAttractions(res.data.content);
                setTotalAttractions(res.data.totalElements);
            } else {
                setAttractions([]);
                setTotalAttractions(0);
            }
        } catch (err) {
            message.error("Failed to load attractions.");
        }
    };

    const fetchFilteredAttractions = async () => {
        const { name, location, category, priceRange } = filters;
        const isEmpty =
            !name && !location && !category && priceRange[0] === 0 && priceRange[1] === 100;

        if (isEmpty) {
            fetchAttractions(1);
            return;
        }

        try {
            let endpoint = "";
            let params: any = {};

            const minPrice = priceRange[0] === 0 ? 1 : priceRange[0];

            if (name) {
                endpoint = "/filterByName";
                params = { name };
            } else if (location) {
                endpoint = "/filterByLocation";
                params = { location };
            } else if (category) {
                endpoint = "/filterByCategory";
                params = { category };
            } else if (priceRange) {
                endpoint = "/filterByPriceRange";
                params = { minPrice, maxPrice: priceRange[1] };
            }

            const res = await axios.get(`http://localhost:8080/attraction${endpoint}`, { params });

            if (res.data) {
                setAttractions(res.data);
                setTotalAttractions(res.data.length);
            } else {
                setAttractions([]);
                setTotalAttractions(0);
                message.error("No attractions found with the given filters.");
            }
        } catch (err) {
            message.error("No attractions found with the given filters.");
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchAttractions(page);
    };

    useEffect(() => {
        fetchAttractions(1);
        fetchAllAttractions();
    }, []);

    return (
        <div className="attractionsPage">
            <h1 className="attractionsTitle">Explore Attractions</h1>

            <Button
                type="primary"
                style={{ marginBottom: 20, marginLeft: 64 }}
                onClick={() => setShowFilters(prev => !prev)}
            >
                {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>



            {showFilters && (
                <div className="filtersContainer">
                    <Input
                        placeholder="Attraction Name"
                        value={filters.name}
                        onChange={e => setFilters(prev => ({ ...prev, name: e.target.value }))}
                        style={{ width: 200, height: 33, marginRight: 16 }}
                    />

                    <Select
                        placeholder="Select Location"
                        allowClear
                        style={{ width: 200, height: 33, marginRight: 16 }}
                        value={filters.location || undefined}
                        onChange={value => {
                            setFilters(prev => ({ ...prev, location: value || "" }));
                            if (!value) {
                                fetchAttractions(1); // refetch default results when cleared
                            }
                        }}
                    >
                        {locations.map(loc => (
                            <Option key={loc} value={loc}>
                                {loc}
                            </Option>
                        ))}
                    </Select>

                    <Select
                        placeholder="Select Category"
                        allowClear
                        style={{ width: 200, height: 33, marginRight: 16 }}
                        value={filters.category || undefined}
                        onChange={value => {
                            setFilters(prev => ({ ...prev, category: value || "" }));
                            if (!value) {
                                fetchAttractions(1); // refetch default results when cleared
                            }
                        }}
                    >
                        {categories.map(cat => (
                            <Option key={cat} value={cat}>
                                {cat}
                            </Option>
                        ))}
                    </Select>

                    <div style={{ width: 250, marginRight: 16 }}>
                        <span style={{ color: "#06202B" }}>Price Range:</span>
                        <Slider
                            className="customSlider"
                            range
                            min={0}
                            max={100}
                            value={filters.priceRange}
                            onChange={value => setFilters(prev => ({ ...prev, priceRange: value }))}
                        />
                    </div>

                    <Button type="primary" onClick={fetchFilteredAttractions}>
                        Filter
                    </Button>
                </div>
            )}

            <Row gutter={[16, 16]} style={{ marginTop: 20, justifyContent: "center" }}>
                {attractions.map(attraction => (
                    <Link
                        to={`/attractions/${attraction.id}`}
                        key={attraction.id}
                        className="attractionCardLink"
                    >
                        <Card
                            className="attractionCard"
                            hoverable
                            cover={
                                <img
                                    alt="Attraction"
                                    src={generalImage}
                                    style={{ objectFit: "cover", height: 180 }}
                                />
                            }
                        >
                            <div className="cardContent">
                                <h3>{attraction.name}</h3>
                                <p><strong>Location:</strong> {attraction.location}</p>
                                <p><strong>Category:</strong> {attraction.category}</p>
                                <p><strong>Price:</strong> ${attraction.price}</p>
                            </div>
                        </Card>
                    </Link>
                ))}
            </Row>

            {!filters.name &&
                !filters.location &&
                !filters.category &&
                filters.priceRange[0] === 0 &&
                filters.priceRange[1] === 100 && (
                    <Pagination
                        current={currentPage}
                        total={totalAttractions}
                        pageSize={4}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        style={{ marginTop: 20, textAlign: "center" }}
                    />
                )}
        </div>
    );
}
