import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PhotoUpload from "./PhotoUpload";
import UserForm from "./UserForm";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserForm />} />
                <Route path="/upload/:uploadId" element={<PhotoUpload />} />
            </Routes>
        </Router>
    );
}

export default App;
