import { useEffect, useRef, useState } from "react";
import { Attraction } from "../../models/attractionModel";
import { Empty, InputNumber, List, Modal, notification } from "antd";
import { Link } from "react-router-dom";
import { Card, Button, Row, Select, Slider, Input, Pagination } from "antd";
import "./attractions.css";
import generalImage from "../../assets/colosseum.jpg";
import {
  getAllAttractions,
  getAttractionsPageable,
  getFilteredAttractions,
  getNearbyAttractions,
} from "../../api/attractionApi";
import { NearbyAttraction } from "../../models/attraction/nearbyAttractionResponse";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import customMarkerBlue from "../../assets/custom-marker-blue.png";
import customMarkerRed from "../../assets/custom-marker-red.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const { Option } = Select;

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
  const [nearbyAttractions, setNearbyAttractions] = useState<
    NearbyAttraction[]
  >([]);
  const [radius, setRadius] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const CustomIconRed = L.icon({
    iconUrl: customMarkerRed,
    shadowUrl: markerShadow,
    iconSize: [25, 40],
    iconAnchor: [12, 40],
  });

  const CustomIconBlue = L.icon({
    iconUrl: customMarkerBlue,
    shadowUrl: markerShadow,
    iconSize: [25, 40],
    iconAnchor: [12, 40],
  });

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
        console.log(data.content);
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
        notification.info({ message: "No attractions matched your filters." });
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
    fetchFilteredAttractions(page, pageSize);
  };

  useEffect(() => {
    fetchFilteredAttractions(1, 4);
    fetchAllAttractions();

    const lat = parseFloat(sessionStorage.getItem("latitude") || "0");
    const lng = parseFloat(sessionStorage.getItem("longitude") || "0");

    if (lat && lng) {
      setPosition([lat, lng]);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 300);
    }
  }, [isModalOpen]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const fetchNearbyAttractions = async (radius: number) => {
    const latitude = parseFloat(sessionStorage.getItem("latitude") || "0");
    const longitude = parseFloat(sessionStorage.getItem("longitude") || "0");

    await getNearbyAttractions(latitude, longitude, radius)
      .then((data) => {
        setNearbyAttractions(data);
      })
      .catch((err) => {
        notification.error({
          message: "Error fetching nearby attractions",
          description: String(err),
        });
      });
  };

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
              setFilters((prev) => ({ ...prev, name: e.target.value }))
            }
            className="attractionInput"
          />

          <Select
            placeholder="Select Location"
            allowClear
            className="attractionSelect"
            value={filters.location || undefined}
            onChange={(value) => {
              setFilters((prev) => ({ ...prev, location: value || "" }));
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
              setFilters((prev) => ({ ...prev, category: value || "" }));
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
                setFilters((prev) => ({ ...prev, priceRange: value }))
              }
            />
          </div>

          <Button
            type="primary"
            onClick={() => fetchFilteredAttractions(1, pageSize)}
          >
            Filter
          </Button>

          <div>
            <InputNumber
              min={0}
              defaultValue={0}
              addonBefore="Radius"
              addonAfter="km"
              className="attractionsRadius"
              onChange={(value) => {
                if (typeof value === "number") {
                  setRadius(value * 1000);
                }
              }}
            />

            <Button
              type="primary"
              onClick={() => {
                fetchNearbyAttractions(radius);
                toggleModal();
              }}
            >
              Search in the area
            </Button>

            <Modal
              width={1000}
              title="Nearby attractions"
              rootClassName="custom-modal"
              closable={{ "aria-label": "Custom Close Button" }}
              open={isModalOpen}
              onCancel={toggleModal}
              footer={null}
            >
              {position && (
                <MapContainer
                  className="attractionsMap"
                  center={position || [45, 25]}
                  zoom={5}
                  ref={(ref) => {
                    if (ref) {
                      mapRef.current = ref;
                      requestAnimationFrame(() => {
                        mapRef.current?.invalidateSize();
                      });
                    }
                  }}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={position} icon={CustomIconRed}>
                    <Tooltip>Your location</Tooltip>
                  </Marker>
                  {nearbyAttractions.map((loc, index) => (
                    <Marker
                      key={index}
                      icon={CustomIconBlue}
                      position={{ lat: loc.latitude, lng: loc.longitude }}
                    >
                      <Tooltip>{loc.name}</Tooltip>
                    </Marker>
                  ))}
                  <Circle center={position} radius={radius} />
                </MapContainer>
              )}
              <List
                dataSource={nearbyAttractions}
                renderItem={(item) => (
                  <List.Item className="nearbyAttractionsItem">
                    <List.Item.Meta
                      title={item.name}
                      description={`Distance: ${Math.trunc(
                        item.distance / 1000
                      )} km`}
                    />
                  </List.Item>
                )}
              />
            </Modal>
          </div>
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
                      <span className="oldPriceTag">
                        ${attraction.oldPrice}
                      </span>
                    )}
                  </p>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <div style={{ width: "100%", textAlign: "center", marginTop: 50 }}>
            <Empty description="No attractions found" />
          </div>
        )}
      </Row>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <Select
          defaultValue={pageSize}
          onChange={(value) => {
            setPageSize(value);
            setCurrentPage(1);
            fetchFilteredAttractions(1, value);
          }}
          style={{ width: 120 }}
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
