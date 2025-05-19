import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ReviewResponse } from "../../models/review/reviewResponse";
import { getAllReviewsByAttractionId } from "../../api/reviewApi";
import {Card, message, Rate} from "antd";
import "./review.css"

export default function Review() {
    const { id } = useParams();
    const [data, setData] = useState<ReviewResponse[]>([]);

    const fetchReviews = async (id: string) => {
        try {
            const all = await getAllReviewsByAttractionId(id);
            setData(all);
        } catch (error) {
            message.error("Failed to fetch reviews");
        }
    };

    useEffect(() => {
        if (id) {
            fetchReviews(id);
        }
    }, [id]);

    return (
        <div className="reviewContainer">
            {data.length > 0 ? (
                <ul className="reviewList">
                    {data.map((review: ReviewResponse, index) => (
                        <Card key={index} id={review.id} className="reviewCard">
                            <div className="reviewUsernameAndDateContainer">
                                <div className="reviewUsername">{review.user.name}</div>
                                <div>{review.createdAt.toString()}</div>
                            </div>
                            <Rate count={5} value={review.rating} disabled={true} className="reviewRate"></Rate>
                            <div>{review.comment}</div>
                        </Card>
                    ))}
                </ul>
            ) : (
                <p>No reviews found.</p>
            )}
        </div>
    );
}
