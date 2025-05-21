import React, {useEffect} from "react";
import "./App.css";
import Attractions from "./pages/attractions/attractions";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Registration from "./pages/user/registration";
import Login from "./pages/user/login";
import Management from "./pages/admin/management";
import AttractionDetail from "./pages/attractions/attractionsDetails";
import ProtectedRoute from "./components/protected-route";
import Wishlist from "./pages/wishlist/wishlist";
import Navbar from "./components/navigation-bar"
import {connectStomp, disconnectStomp} from "./api/stompClient";
import {notification} from "antd";
import Home from "./pages/home/home";
import Statistics from "./pages/admin/statistics";
import Review from "./pages/review/review";
import Contact from "./pages/contactAdmin/contact";

function App() {

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

        sessionStorage.removeItem("notifications");

        if (isAuthenticated) {
            disconnectStomp()

            connectStomp((msg) => {
                const notifications = JSON.parse(sessionStorage.getItem("notifications") || "[]");
                notifications.push(msg);

                sessionStorage.setItem("notifications", JSON.stringify(notifications));
                window.dispatchEvent(new Event("new-notification"));

                notification.success({
                    message: "New Offer",
                    description: msg.message,
                    duration: 3,
                });
            });
        }
    }, []);

    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/register" element={<Registration/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/attractions/:id" element={<AttractionDetail/>}/>
                <Route path="/attractions" element={<Attractions/>}/>
                <Route path="/reviews/:id" element={<Review/>}/>
                <Route path="/wishlist" element={<Wishlist/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute adminOnly>
                            <Management/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/statistics"
                    element={
                        <ProtectedRoute adminOnly>
                            <Statistics/>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
