import React, {useState} from 'react';
import car from '../../assets/travel_car.svg';
import './home.css';
import {Button} from "antd";
import {SizeType} from "antd/es/config-provider/SizeContext";
import {Link} from "react-router-dom";

export default function Home() {
    return (
        <div className="homeContainer">
            <div>
                <div className="textMoto">
                    Power up your
                    <div className="textKeyword">adventures</div>
                </div>
                <p className="textParagraph">
                    From weekend escapes to dream vacations, TravelPoints helps you turn every trip into an
                    unforgettable experience.
                    Earn rewards as you explore, discover hidden gems, and make every mile count.
                    It's more than travel — it's your next great story waiting to unfold.
                </p>
                <Link to="attractions">
                    <Button size={"large"} className="travelButton">Let's travel !</Button>
                </Link>
            </div>
            <img src={car} alt="car" className="carSvg"/>
        </div>
    );
}
