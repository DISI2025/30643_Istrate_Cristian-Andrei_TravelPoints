export default function Attractions() {
    const attractions = [
        { id: 1, name: "Eiffel Tower", location: "Paris", category: "Monument", price: 25 },
        { id: 2, name: "Statue of Liberty", location: "New York", category: "Landmark", price: 30 },
    ];

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
