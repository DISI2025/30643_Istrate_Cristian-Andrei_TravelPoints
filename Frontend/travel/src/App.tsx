import React from "react";
import "./App.css";
import Attractions from "./pages/attractions/attractions";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Registration from "./pages/user/registration";
import Login from "./pages/user/login";
import Management from "./pages/admin/management";
import AttractionDetail from "./pages/attractions/attractionsDetails";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<Registration/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/attractions/:id" element={<AttractionDetail/>}/>
                <Route path="/attractions" element={<Attractions/>}/>
                <Route path="/admin" element={<Management/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
