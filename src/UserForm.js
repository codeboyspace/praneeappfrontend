import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        photo: null
    });

    const [qrCode, setQrCode] = useState(null);
    const [uploadId, setUploadId] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120);
    const [showOverlay, setShowOverlay] = useState(false);
    const [uploadedPhoto, setUploadedPhoto] = useState(null);

    // Handle File Upload (from Computer)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setUploadedPhoto(file);
        setShowQR(false);
        setShowOverlay(true);
    };

    // Generate QR Code for Phone Upload
    const generateQrCode = async () => {
        const res = await axios.post("https://praneeappbackend.onrender.com/api/generate_qr/");
        setUploadId(res.data.upload_id);
        setQrCode(`https://praneeappfrontend-b3lrkk54y-codeboyspaces-projects.vercel.app/upload/${res.data.upload_id}`);
        setShowQR(true);
    };

    // Fetch Uploaded Photo from Phone
    const checkForUploadedPhoto = async () => {
        try {
            const response = await axios.get(`https://praneeappbackend.onrender.com/api/get_uploaded_photo/${uploadId}/`);
            if (response.data.photo_url) {
                setUploadedPhoto(response.data.photo_url);
                setShowQR(false);
                setShowOverlay(true);
                toast.success("Photo uploaded successfully!");
            } else {
                console.log("No photo found for the given upload ID.");
            }
        } catch (error) {
            console.error("Error fetching uploaded photo:", error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        let interval;
        if (showQR && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
                checkForUploadedPhoto();
            }, 1000);
        } else if (timeLeft === 0) {
            setShowQR(false);
            toast.error("Image selection timed out.");
        }
        return () => clearInterval(interval);
    }, [showQR, timeLeft]);

    const confirmImage = () => {
        setFormData((prevData) => ({ ...prevData, photo: uploadedPhoto }));
        setShowOverlay(false);
        toast.success("Image confirmed!");
    };

    const cancelSelection = () => {
        setUploadedPhoto(null);
        setShowOverlay(false);
    };

    const closeOverlay = () => {
        setShowOverlay(false);
        setShowQR(false);
        setUploadedPhoto(null);
    };

    const styles = {
        container: {
            fontFamily: "Arial, sans-serif",
            textAlign: "center",
            padding: "20px",
            backgroundColor: "#f4f4f9",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            maxWidth: "400px",
            margin: "50px auto",
        },
        header: {
            color: "#333",
        },
        button: {
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
            marginLeft: "5px",
        },
        overlay: {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        overlayContent: {
            position: "relative",
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
        },
        closeButton: {
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
        },
        qrContainer: {
            marginTop: "20px",
        },
        qrText: {
            margin: "10px 0",
        },
        uploadedPhoto: {
            marginTop: "20px",
        },
        photoImg: {
            borderRadius: "5px",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
        },
        qrCodeStyle: {
            width: "200px",
            height: "200px",
        },
    };

    return (
        <div style={styles.container}>
            <ToastContainer />
            <h2 style={styles.header}>Upload Your Photo</h2>
            <button style={styles.button} onClick={() => setShowOverlay(true)}>Upload Image</button>

            {showOverlay && (
                <div style={styles.overlay}>
                    <div style={styles.overlayContent}>
                        <button style={styles.closeButton} onClick={closeOverlay}>
                            &times;
                        </button>
                        {showQR ? (
                            <div style={styles.qrContainer}>
                                <p style={styles.qrText}>Scan this QR with your phone</p>
                                <QRCodeCanvas style={styles.qrCodeStyle} value={qrCode} />
                                <p style={styles.qrText}>Time left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}</p>
                            </div>
                        ) : uploadedPhoto ? (
                            <div>
                                <img
                                    src={typeof uploadedPhoto === "string" ? uploadedPhoto : URL.createObjectURL(uploadedPhoto)}
                                    alt="Uploaded"
                                    width={100}
                                    style={styles.photoImg}
                                />
                                <button style={styles.button} onClick={confirmImage}>Confirm Image</button>
                                <button style={styles.button} onClick={cancelSelection}>Cancel Selection</button>
                            </div>
                        ) : (
                            <div>
                                <button style={styles.button} onClick={generateQrCode}>Upload from Phone</button>
                                <button style={styles.button} onClick={() => document.getElementById('fileInput').click()}>Browse from Computer</button>
                                <input id="fileInput" type="file" style={{ display: 'none' }} onChange={handleFileChange} />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {formData.photo && (
                <div style={styles.uploadedPhoto}>
                    <h4>Uploaded Photo:</h4>
                    <img
                        src={typeof formData.photo === "string" ? formData.photo : URL.createObjectURL(formData.photo)}
                        alt="Uploaded"
                        width={100}
                        style={styles.photoImg}
                    />
                </div>
            )}
        </div>
    );
};

export default UserForm;
