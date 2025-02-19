import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const PhoneUpload = () => {
    const { uploadId } = useParams();
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    // Handle Photo Selection
    const handleFileChange = (e) => {
        setSelectedPhoto(e.target.files[0]);
    };

    // Upload Photo to Server
    const uploadPhoto = async () => {
        const formData = new FormData();
        formData.append("photo", selectedPhoto);

        await axios.post(`https://praneeappbackend.onrender.com/api/upload_photo/${uploadId}/`, formData);
        alert("Photo uploaded! You can check on your computer.");
    };

    return (
        <div>
            <h2>Upload Photo from Phone</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={uploadPhoto}>Select this Picture</button>
        </div>
    );
};

export default PhoneUpload;
