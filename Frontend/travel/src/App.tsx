import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Registration from "./pages/user/registration";
import Login from "./pages/user/login";
import Management from "./pages/admin/management";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Management />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
