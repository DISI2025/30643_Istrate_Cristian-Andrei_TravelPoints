import {attractions} from "./mockData";

export default function Attractions() {

    return (
        <div className="attractionsPage">
            <h1 className="attractionsTitle">Explore Attractions</h1>
            <ul>
                {attractions.map((attraction) => (
                    <li key={attraction.id}>
                        <strong>{attraction.name}</strong> - {attraction.location}, {attraction.category}, ${attraction.price}
                    </li>
                ))}
            </ul>
        </div>
    );
}
