import {useEffect, useState} from "react";
import axios from "axios";
import {Attraction} from "../../models/attractionModel";
import {Empty, notification} from "antd";
import {Link} from "react-router-dom";
import {
    Card,
    Button,
    Row,
    Select,
    Slider,
    Input,
    Pagination,
    message,
} from "antd";
import "./attractions.css";
import generalImage from "../../assets/colosseum.jpg";
import {
    getAllAttractions,
    getAttractionsPageable,
    getFilteredAttractions,
} from "../../api/attractionApi";

const {Option} = Select;

export default function Attractions() {
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState<number>(0.0);
    const [maxPrice, setMaxPrice] = useState<number>(0.0);
    const [filters, setFilters] = useState({
        name: "",
        location: "",
        category: "",
        priceRange: [0, 100],
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalAttractions, setTotalAttractions] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [pageSize, setPageSize] = useState(4);


    const fetchAllAttractions = async () => {
        try {
            const allAttractions: Attraction[] = await getAllAttractions();
            const uniqueLocations = Array.from(
                new Set(allAttractions.map((a) => a.location))
            );
            const uniqueCategories = Array.from(
                new Set(allAttractions.map((a) => a.category))
            );
            const prices = allAttractions.map((a) => a.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            setMinPrice(minPrice);
            setMaxPrice(maxPrice);
            setLocations(uniqueLocations);
            setCategories(uniqueCategories);
        } catch (err) {
            notification.error({
                message: "Failed to load filter data",
                description: err + ".",
            });
        }
    };

    const fetchAttractions = async (page: number = 1, size: number = 4) => {
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

    const fetchFilteredAttractions = async (page = 1, size = pageSize) => {
        try {
            const data = await getFilteredAttractions(filters, page, size);

            if (!data?.content) {
                setAttractions([]);
                setTotalAttractions(0);
                notification.info({message: "No attractions matched your filters."});
                return;
            }

            setAttractions(data.content);
            setTotalAttractions(data.totalElements);
        } catch (err) {
            notification.error({
                message: "Unexpected error occurred",
                description: String(err),
            });
        }
    };


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchFilteredAttractions(page, pageSize)
    };


    useEffect(() => {
        fetchFilteredAttractions(1, 4);
        fetchAllAttractions();
    }, []);

    return (
        <div className="attractionsPage">
            <Button
                type="primary"
                className="filterButton"
                onClick={() => setShowFilters((prev) => !prev)}
            >
                {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>

            {showFilters && (
                <div className="filtersContainer">
                    <Input
                        placeholder="Attraction Name"
                        value={filters.name}
                        onChange={(e) =>
                            setFilters((prev) => ({...prev, name: e.target.value}))
                        }
                        className="attractionInput"
                    />

                    <Select
                        placeholder="Select Location"
                        allowClear
                        className="attractionSelect"
                        value={filters.location || undefined}
                        onChange={(value) => {
                            setFilters((prev) => ({...prev, location: value || ""}));
                            if (!value) {
                                fetchAttractions(1); // refetch default results when cleared
                            }
                        }}
                    >
                        {locations.map((loc) => (
                            <Option key={loc} value={loc} label={loc}>
                                {loc}
                            </Option>
                        ))}
                    </Select>

                    <Select
                        placeholder="Select Category"
                        allowClear
                        className="attractionCategorySelect"
                        value={filters.category || undefined}
                        onChange={(value) => {
                            setFilters((prev) => ({...prev, category: value || ""}));
                            if (!value) {
                                fetchAttractions(1);
                            }
                        }}
                    >
                        {categories.map((cat) => (
                            <Option key={cat} value={cat} label={cat}>
                                {cat}
                            </Option>
                        ))}
                    </Select>

                    <div className="priceRangeContainer">
                        <span className="priceRangeLabel">Price Range:</span>
                        <Slider
                            className="customSlider"
                            range
                            min={minPrice}
                            max={maxPrice}
                            value={filters.priceRange}
                            onChange={(value) =>
                                setFilters((prev) => ({...prev, priceRange: value}))
                            }
                        />
                    </div>

                    <Button type="primary" onClick={() => fetchFilteredAttractions(1, pageSize)}>
                        Filter
                    </Button>
                </div>
            )}
            <Row className="attractionsRow">
                {attractions.length > 0 ? (
                    attractions.map((attraction) => (
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
                                        className="attractionImage"
                                    />
                                }
                            >
                                <div className="cardContent">
                                    <h3>{attraction.name}</h3>
                                    <p>
                                        <strong>Location:</strong> {attraction.location}
                                    </p>
                                    <p>
                                        <strong>Category:</strong> {attraction.category}
                                    </p>
                                    <p>
                                        <strong>Price:</strong> ${attraction.price}
                                        {attraction.oldPrice > attraction.price && (
                                            <span className="oldPriceTag">${attraction.oldPrice}</span>
                                        )}
                                    </p>
                                </div>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <div style={{width: "100%", textAlign: "center", marginTop: 50}}>
                        <Empty description="No attractions found"/>
                    </div>
                )}
            </Row>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16}}>
                <Select
                    defaultValue={pageSize}
                    onChange={(value) => {
                        setPageSize(value);
                        setCurrentPage(1);
                        fetchFilteredAttractions(1, value)
                    }}
                    style={{width: 120}}
                >
                    {[4, 8, 12].map((size) => (
                        <Option key={size} value={size} label={size}>
                            {size} / page
                        </Option>
                    ))}
                </Select>

                <Pagination
                    current={currentPage}
                    total={totalAttractions}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    className="paginationStyles"
                />
            </div>
        </div>
    );
}
