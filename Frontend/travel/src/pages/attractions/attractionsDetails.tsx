import {useParams, useNavigate, Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {Carousel, ConfigProvider, Modal, notification, Rate, Tooltip} from "antd";
import axios from "axios";
import {Card, Button} from "antd";
import "./attractionsDetails.css";
import generalImage from "../../assets/colosseum.jpg"
import {getAttractionById} from "../../api/attractionApi";
import {
    CaretRightOutlined,
    CheckCircleFilled,
    CheckCircleOutlined,
    EnvironmentFilled, PauseOutlined, PushpinFilled,
    StarFilled,
    StarOutlined
} from "@ant-design/icons";
import {createWishlist, deleteWishlist, getWishlistByUserIdAndAttractionId} from "../../api/wishlistApi";
import {WishlistResponse} from "../../models/wishlist/wishlistResponse";
import {addVisit, deleteVisit, getVisitOfUserAndAttraction} from "../../api/visitApi";
import {VisitResponse} from "../../models/visit/visitResponse";
import {Form, Input} from "antd";
import {ReviewRequest} from "../../models/review/reviewRequest";
import {createReview} from "../../api/reviewApi";

const {TextArea} = Input;


export default function AttractionDetail() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [attraction, setAttraction] = useState<any>(null);
    const [addToWishlist, setAddToWishlist] = useState<boolean>(false);
    const [visit, setVisit] = useState<VisitResponse | null>();
    const [audio, setAudio] = useState<boolean>(false);
    const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const [form] = Form.useForm();

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
            let visit = await getVisitOfUserAndAttraction(data.id,auxId!)
            setVisit(visit);

            wishlist ? setAddToWishlist(true) : setAddToWishlist(false);
        } catch (err) {
            notification.error({
                message: "Failed to load attraction details. Please try again later.",
                description: String(err),
            });
        }
    };

    const toggleVisited = async () => {
        if (!userId || !attraction?.id) {
            notification.warning({message: "You must be logged in to manage your wishlist."});
            return;
        }
        try{
            if(!visit){
                const visitRequest = {
                    userId,
                    attractionId: attraction.id,
                    visitTimestamp: new Date().toISOString(),
                };
                setVisit(await addVisit(visitRequest));
                notification.success({message: "Attraction marked as visited!"});
            }else{
                await deleteVisit(visit?.id);
                setVisit(null);
                notification.success({message: "Attraction marked as unvisited"});
            }
        }catch (err) {
            notification.error({message: "Visit update failed", description: String(err)});
        }
    }



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

    const togglePlayAudio = async () => {
        if (!attraction?.descriptionAudio) {
            notification.warning({message: "No audio description available."});
            return;
        }

        if (!audioPlayer) {
            const newAudio = new Audio(attraction.descriptionAudio);
            try {
                await newAudio.play();
            } catch (err) {
                notification.warning({message: "Failed to load audio player!"});
                return;
            }
            setAudioPlayer(newAudio);
            setAudio(true);

            newAudio.onended = () => {
                setAudio(false);
                setAudioPlayer(null);
            };
        } else {
            audioPlayer.pause();
            setAudio(false);
            setAudioPlayer(null);
        }
    };


    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const review: ReviewRequest = {
                attractionId: attraction.id,
                rating: values.rating,
                comment: values.comment
            };

            await createReview(userId!, review);

            notification.success({ message: "Review submitted successfully!" });
            setModalVisible(false);
            form.resetFields();
        } catch (err: any) {
            if (err?.errorFields) {
                console.log('Validation Failed:', err);
            } else {
                console.error("Review submission failed:", err);
                notification.error({
                    message: "Failed to submit review",
                    description: err?.response?.data?.message || "An unexpected error occurred.",
                });
            }
        }
    };


    if (!attraction) return <div className="loading">Loading attraction...</div>;

    return (
        <div className="attractionDetailContainer">
            <Card className="attractionDetailCard">
                <div className="cardContent">
                    <ConfigProvider componentSize="large">
                        <Tooltip placement="top" title="Wishlist">
                            <Button shape="circle" className="starButton" onClick={toggleWishlist}>
                                {addToWishlist ? <StarFilled/> : <StarOutlined/>}
                            </Button>
                        </Tooltip>
                        <Tooltip placement="top" title={visit ? "Mark as Unvisited" : "Mark as Visited"}>
                            <Button shape="circle" className="visitedButton" onClick={toggleVisited}>
                                {visit ? <CheckCircleFilled/> : <CheckCircleOutlined/>}
                            </Button>
                        </Tooltip>
                        <Tooltip placement="top" title={audio ? "Stop" : "Play"}>
                            <Button shape="circle" className="audioButton" onClick={togglePlayAudio}>
                                {audio ? <PauseOutlined/> : <CaretRightOutlined/>}
                            </Button>
                        </Tooltip>
                    </ConfigProvider>
                    <h1 className="detailTitle">{attraction.name}</h1>
                    <p className="locationDetail">
                        <EnvironmentFilled className={"locationIcon"}/>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(attraction.location)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="locationLink"
                        >
                            {attraction.location}
                        </a>
                    </p>

                    <Carousel autoplay={{dotDuration: true}} autoplaySpeed={3000} arrows infinite={true}>
                        {[...Array(5)].map((_, index) => (
                            <img
                                key={index}
                                src={generalImage}
                                alt={`Attraction ${index + 1}`}
                                className="galleryImage"
                            />
                        ))}
                    </Carousel>
                    <div className="categoryAndPriceDetails">
                        <span className="detailField">
                            <PushpinFilled /> {attraction.category}
                        </span>
                        <p className="priceField">
                            <span className="newPrice"> ${attraction.price}</span>
                            {attraction.oldPrice > attraction.price && (
                                <span className="oldPrice">${attraction.oldPrice}</span>
                            )}
                        </p>
                    </div>
                    <p className="detailField"><strong>Description:</strong> {attraction.descriptionText}</p>
                    <p className="detailField"><strong>Offers:</strong> {attraction.offers}</p>
                    <Button type="primary" className="reviewButton" onClick={() => setModalVisible(true)}>
                        Add Review
                    </Button>
                    <Modal
                        title="Share your experience"
                        open={isModalVisible}
                        onCancel={() => setModalVisible(false)}
                        footer={[
                            <Button key="submit" type="primary" onClick={handleSubmit}>
                                Submit
                            </Button>
                        ]}
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="rating"
                                label="Rating"
                                rules={[{required: true, message: 'Please provide a rating!'}]}
                            >
                                <Rate/>
                            </Form.Item>
                            <Form.Item
                                name="comment"
                                label="Your Comment"
                                rules={[{required: true, message: 'Please write your review!'}]}
                            >
                                <TextArea rows={4} placeholder="Write here..."/>
                            </Form.Item>
                        </Form>
                    </Modal>

                </div>
            </Card>
            <Button type="primary" className="reviewsLink" onClick={() => navigate(`/reviews/${attraction.id}`)}>
                <span>Show Reviews</span>
            </Button>
        </div>
    );
}

