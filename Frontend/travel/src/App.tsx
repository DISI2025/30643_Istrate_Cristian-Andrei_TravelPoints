import React from "react";
import "./App.css";
import Registration from "./pages/user/registration";
import Attractions from "./pages/attractions/attractions";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Registration />} />
          <Route path="/attractions" element={<Attractions />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
