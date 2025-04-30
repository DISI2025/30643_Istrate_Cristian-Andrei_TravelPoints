import {attractions} from "./mockData";

import { useEffect, useState } from "react";
import axios from "axios";

type Attraction = {
    id: number;
    name: string;
    location: string;
    category: string;
    price: number;
};

export default function Attractions() {

    const [attractions, setAttractions] = useState<Attraction[]>([]);

    useEffect(() => {
        axios.get("http://localhost:9090/attraction/getAllPageable?pageNumber=0&pageSize=5")
            .then(res => setAttractions(res.data.content))
            .catch(() => alert("Failed to load attractions"));
    }, []);

    return (
        <div className="attractionsPage">
            <h1 className="attractionsTitle">Explore Attractions</h1>
            <ul>
                {attractions.map(attraction => (
                    <li key={attraction.id}>
                        <strong>{attraction.name}</strong> - {attraction.location}, {attraction.category}, ${attraction.price}
                    </li>
                ))}
            </ul>
        </div>
    );
}
