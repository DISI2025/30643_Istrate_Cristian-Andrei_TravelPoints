import {useParams, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {ConfigProvider, notification, Tooltip} from "antd";
import axios from "axios";
import {Card, Button} from "antd";
import "./attractionsDetails.css";
import generalImage from "../../assets/colosseum.jpg"
import {getAttractionById} from "../../api/attractionApi";
import {StarFilled, StarOutlined} from "@ant-design/icons";
import {createWishlist, deleteWishlist, getWishlistByUserIdAndAttractionId} from "../../api/wishlistApi";
import {WishlistResponse} from "../../models/wishlist/wishlistResponse";

export default function AttractionDetail() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [attraction, setAttraction] = useState<any>(null);
    const [addToWishlist, setAddToWishlist] = useState<boolean>(false);

    const userId = localStorage.getItem("id");

    useEffect(() => {
        if (!id) return;

        fetchAttraction(id);

    }, [id]);


    const fetchAttraction = async (id: string) => {
        try {
            const data = await getAttractionById(id);
            setAttraction(data);
            const auxId = localStorage.getItem("id");
            const wishlist: WishlistResponse = await getWishlistByUserIdAndAttractionId(auxId!, data.id);
            wishlist ? setAddToWishlist(true) : setAddToWishlist(false);
        } catch (err) {
            notification.error({
                message: "Failed to load attraction details. Please try again later.",
                description: String(err),
            });
        }
    };

    const toggleWishlist = async () => {
        if (!userId || !attraction?.id) {
            notification.warning({message: "You must be logged in to manage your wishlist."});
            return;
        }
        try {

            if (!addToWishlist) {
                const wishlistRequest = {
                    userId,
                    attractionId: attraction.id,
                    addedAt: new Date().toISOString(),
                };
                await createWishlist(wishlistRequest);
                notification.success({message: "Added to wishlist!"});
            } else {
                const wishlist: WishlistResponse = await getWishlistByUserIdAndAttractionId(userId, attraction.id);
                await deleteWishlist(wishlist.id);
                notification.info({message: "Removed from wishlist."});
            }
            setAddToWishlist(!addToWishlist);
        } catch (err) {
            notification.error({message: "Wishlist update failed", description: String(err)});
        }
    }

    if (!attraction) return <div className="loading">Loading attraction...</div>;

    return (
        <div className="attractionDetailContainer">
            <Button onClick={() => navigate(-1)} className="backButton">
                ← Back
            </Button>
            <Card className="attractionDetailCard">
                <div className="cardContent">
                    <ConfigProvider componentSize="large">
                        <Tooltip placement="left" title="Wishlist">
                            <Button shape="circle" className="starButton" onClick={toggleWishlist}>
                                {addToWishlist ? <StarFilled/> : <StarOutlined/>}
                            </Button>
                        </Tooltip>
                    </ConfigProvider>
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
                        {attraction.oldPrice > 0  && (
                            <span className="oldPrice">${attraction.oldPrice}</span>
                        )}
                    </p>
                    <p className="detailField"><strong>Description:</strong> {attraction.descriptionText}</p>
                    <p className="detailField"><strong>Offers:</strong> {attraction.offers}</p>
                </div>
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

