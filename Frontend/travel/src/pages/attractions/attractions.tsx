import { Card, Button, Row, Col, message, Select, Slider, Input, Pagination } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./attractions.css";

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
    const [currentPage, setCurrentPage] = useState(1); // Track current page number
    const [totalAttractions, setTotalAttractions] = useState(0); // Total attractions for pagination

    const extractFiltersFromData = (data: Attraction[]) => {
        const uniqueLocations = Array.from(new Set(data.map(a => a.location)));
        const uniqueCategories = Array.from(new Set(data.map(a => a.category)));
        setLocations(uniqueLocations);
        setCategories(uniqueCategories);
    };

    // Fetch paginated attractions (by default, get first page)
    const fetchAttractions = async (page: number = 1) => {
        try {
            const res = await axios.get("http://localhost:8080/attraction/getAllPageable", {
                params: {
                    pageNumber: page - 1, // Backend uses 0-based index
                    pageSize: 4, // Set the page size (4 items per page)
                },
            });

            if (res.data && res.data.content) {
                setAttractions(res.data.content); // Set attractions for the current page
                setTotalAttractions(res.data.totalElements); // Set total number of attractions
                extractFiltersFromData(res.data.content); // Extract filters from current page's attractions
            } else {
                setAttractions([]);
                setTotalAttractions(0);
            }
        } catch (err) {
            message.error("Failed to load attractions.");
        }
    };

    // Fetch filtered attractions without pagination
    const fetchFilteredAttractions = async () => {
        const { name, location, category, priceRange } = filters;
        const isEmpty =
            !name && !location && !category && priceRange[0] === 0 && priceRange[1] === 100;

        if (isEmpty) {
            fetchAttractions(1); // Fetch all attractions with pagination if no filters are applied
            return;
        }

        try {
            let endpoint = "";
            let params: any = {};

            // Fix for minPrice being zero, replace with 1 if the user selects 0 as the min price
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

            // Fetch filtered attractions
            const res = await axios.get(`http://localhost:8080/attraction${endpoint}`, { params });

            if (res.data) {
                setAttractions(res.data); // Set filtered attractions
                setTotalAttractions(res.data.length); // Set the total count of filtered attractions
            } else {
                setAttractions([]);
                setTotalAttractions(0);
                message.error("No attractions found with the given filters.");
            }
        } catch (err) {
            message.error("No attractions found with the given filters.");
        }
    };

    // Handle page change for paginated view
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchAttractions(page); // Fetch paginated attractions for selected page
    };

    useEffect(() => {
        fetchAttractions(1); // Fetch attractions on initial load
    }, []);

    return (
        <div className="attractionsPage">
            <h1 className="attractionsTitle">Explore Attractions</h1>

            <div className="filtersContainer">
                <Input
                    placeholder="Attraction Name"
                    value={filters.name}
                    onChange={e => setFilters(prev => ({ ...prev, name: e.target.value }))}
                    style={{ width: 200,height: 33, marginRight: 16 }}
                />

                <Select
                    placeholder="Select Location"
                    allowClear
                    style={{ width: 200,height: 33, marginRight: 16 }}
                    value={filters.location || undefined}
                    onChange={value => setFilters(prev => ({ ...prev, location: value }))}
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
                    style={{ width: 200,height: 33, marginRight: 16 }}
                    value={filters.category || undefined}
                    onChange={value => setFilters(prev => ({ ...prev, category: value }))}
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

            {/* Display Attraction Cards */}
            <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                {attractions.map(attraction => (
                    <Link
                        to={`/attractions/${attraction.id}`}
                        key={attraction.id}
                        className="attractionCardLink"
                    >
                        <Card className="attractionCard" hoverable>
                            <h3>{attraction.name}</h3>
                            <p><strong>Location:</strong> {attraction.location}</p>
                            <p><strong>Category:</strong> {attraction.category}</p>
                            <p><strong>Price:</strong> ${attraction.price}</p>
                        </Card>
                    </Link>
                ))}
            </Row>


            {/* Pagination (only when not filtering) */}
            {!filters.name && !filters.location && !filters.category && filters.priceRange[0] === 0 && filters.priceRange[1] === 100 && (
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
