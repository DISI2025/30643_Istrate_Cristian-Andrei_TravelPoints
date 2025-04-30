import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button } from "antd";
import "./attractionsDetails.css";
import generalImage from "../../assets/colosseum.jpg"

export default function AttractionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [attraction, setAttraction] = useState<any>(null);

    useEffect(() => {
        axios.get(`http://localhost:9090/attraction/find/${id}`)
            .then(res => setAttraction(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!attraction) return <div className="loading">Loading attraction...</div>;

    return (
        <div className="attractionDetailContainer">
            <Button onClick={() => navigate(-1)} className="backButton">
                ← Back
            </Button>
            <Card className="attractionDetailCard">
                <h1 className="detailTitle">{attraction.name}</h1>
                <p className="detailField">
                    <strong>Location:</strong>{" "}
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(attraction.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="locationLink"
                    >
                        {attraction.location}
                    </a>
                </p>

                <p className="detailField"><strong>Category:</strong> {attraction.category}</p>
                <p className="detailField">
                    <strong>Price:</strong> ${attraction.price}
                    {attraction.oldPrice && (
                        <span className="oldPrice" >${attraction.oldPrice}</span>
                    )}
                </p>
                <p className="detailField"><strong>Description:</strong> {attraction.descriptionText}</p>
                <p className="detailField"><strong>Offers:</strong> {attraction.offers}</p>
            </Card>

            <div className="imageGallery">
                {[...Array(5)].map((_, index) => (
                    <img
                        key={index}
                        src={generalImage}
                        alt={`Attraction ${index + 1}`}
                        className="galleryImage"
                    />
                ))}
            </div>
        </div>
    );
}

