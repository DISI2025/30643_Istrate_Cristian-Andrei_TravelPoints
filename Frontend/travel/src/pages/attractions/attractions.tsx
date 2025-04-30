import {useEffect, useState} from "react";
import axios from "axios";
import {Attraction} from "../../models/attractionModel"
import {notification} from "antd";
import { Card, Row } from "antd";
import { Link } from "react-router-dom";
import "./attractions.css";
import generalImage from "../../assets/colosseum.jpg"


export default function Attractions() {

    const [attractions, setAttractions] = useState<Attraction[]>([]);

    useEffect(() => {
        axios.get("http://localhost:9090/attraction/getAllPageable?pageNumber=0&pageSize=5")
            .then(res => setAttractions(res.data.content))
            .catch((err) => notification.error({message: "Failed to load attractions", description: err + "."}));
    }, []);

    return (
        <div className="attractionsPage">
            <h1 className="attractionsTitle">Explore Attractions</h1>
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
                            cover={<img alt="Attraction" src={generalImage}  className="attractionImage" />}
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

        </div>
    );


}
