import React from "react";
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
import Home from "./pages/home/home";
import Statistics from "./pages/admin/statistics";
import Review from "./pages/review/review";

function App() {
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
