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
        <div style={styles.container}>
            <h2 style={styles.header}>Upload Photo from Phone</h2>
            <input type="file" onChange={handleFileChange} style={styles.fileInput} />
            <button onClick={uploadPhoto} style={styles.button}>Select this Picture</button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        margin: 'auto',
    },
    header: {
        color: '#333',
        marginBottom: '20px',
    },
    fileInput: {
        marginBottom: '20px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    button: {
        backgroundColor: '#007BFF',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default PhoneUpload;
