import {useEffect, useState} from "react";
import axios from "axios";
import {Attraction} from "../../models/attractionModel"
import {notification} from "antd";
import {Link} from "react-router-dom";
import {
    Card, Button, Row, Select, Slider, Input, Pagination, message,
} from "antd";
import "./attractions.css";
import generalImage from "../../assets/colosseum.jpg";
import { getAllAttractions, getAttractionsPageable, getFilteredAttractions } from "../../api/attractionApi";

const {Option} = Select;

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
            const allAttractions: Attraction[] = await getAllAttractions();
            const uniqueLocations = Array.from(new Set(allAttractions.map(a => a.location)));
            const uniqueCategories = Array.from(new Set(allAttractions.map(a => a.category)));
            setLocations(uniqueLocations);
            setCategories(uniqueCategories);
        } catch (err) {
            notification.error({
                message: "Failed to load filter data",
                description: err + ".",
            });
        }
    };

    const fetchAttractions = async (page: number = 1) => {
        try {
            const data = await getAttractionsPageable(page - 1, 4);
            if (data?.content) {
                setAttractions(data.content);
                setTotalAttractions(data.totalElements);
            } else {
                setAttractions([]);
                setTotalAttractions(0);
            }
        } catch (err) {
            notification.error({
                message: "Failed to load attractions",
                description: err + ".",
            });
        }
    };

    const fetchFilteredAttractions = async () => {
        const { name, location, category, priceRange } = filters;
        const isEmpty = !name && !location && !category && priceRange[0] === 0 && priceRange[1] === 100;

        if (isEmpty) {
            fetchAttractions(1);
            return;
        }

        try {
            const data = await getFilteredAttractions(filters);
            if (data) {
                setAttractions(data);
                setTotalAttractions(data.length);
            } else {
                setAttractions([]);
                setTotalAttractions(0);
                notification.error({ message: "No attractions found with the given filters" });
            }
        } catch (err) {
            notification.error({
                message: "No attractions found with the given filters",
                description: err + ".",
            });
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
                className="filterButton"
                onClick={() => setShowFilters(prev => !prev)}
            >
                {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>


            {showFilters && (
                <div className="filtersContainer">
                    <Input
                        placeholder="Attraction Name"
                        value={filters.name}
                        onChange={e => setFilters(prev => ({...prev, name: e.target.value}))}
                        className="attractionInput"
                    />

                    <Select
                        placeholder="Select Location"
                        allowClear
                        className="attractionSelect"
                        value={filters.location || undefined}
                        onChange={value => {
                            setFilters(prev => ({...prev, location: value || ""}));
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
                        className="attractionCategorySelect"
                        value={filters.category || undefined}
                        onChange={value => {
                            setFilters(prev => ({...prev, category: value || ""}));
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

                    <div className="priceRangeContainer">
                        <span className="priceRangeLabel">Price Range:</span>
                        <Slider
                            className="customSlider"
                            range
                            min={0}
                            max={100}
                            value={filters.priceRange}
                            onChange={value => setFilters(prev => ({...prev, priceRange: value}))}
                        />
                    </div>

                    <Button type="primary" onClick={fetchFilteredAttractions}>
                        Filter
                    </Button>
                </div>
            )}
            <Row className="attractionsRow">
                {attractions.map(attraction => (
                    <Link
                        to={`/attractions/${attraction.id}`}
                        key={attraction.id}
                        className="attractionCardLink"
                    >
                        <Card
                            className="attractionCard"
                            hoverable
                            cover={<img alt="Attraction" src={generalImage} className="attractionImage"/>}
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
                        className="paginationStyles"
                    />
                )}
        </div>
    );
}
