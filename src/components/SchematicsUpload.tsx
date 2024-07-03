import "../styles/schematicsupload.scss";
import React, { useState, useEffect } from "react";
import checkmark from "../assets/nugget_of_experience.webp";
import xmark from "../assets/polished_rose_quartz.webp";
import paper_checkmark from "../assets/paper_checkmark.png";
import arrow_left from "../assets/ui_arrow_left.png";
import LoadingAnimation from "./LoadingAnimation";
import LoadingSuccess from "../components/LoadingOverlays/LoadingSuccess";
import { useNavigate } from "react-router-dom";

function SchematicsUpload() {
    const [uploadedImage, setFile] = useState<string>();
    const [isSchematicUploaded, setIsSchematicUploaded] = useState<boolean>(false);
    const [isSchematicError, setIsSchematicError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [showFinalMessage, setShowFinalMessage] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) {
            const timer = setTimeout(() => {
                setShowFinalMessage(true);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [loading]);

    useEffect(() => {
        if (showFinalMessage) {
            const redirectTimer = setTimeout(() => {
                navigate("/schematics");
            }, 500);

            return () => clearTimeout(redirectTimer);
        }
    }, [showFinalMessage, navigate]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            console.log(e.target.files);
            setFile(URL.createObjectURL(e.target.files[0]));
        }
    }

    function handleSchematicChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const file = e.target.files[0];
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            
            if (fileExtension === 'nbt') {
                setIsSchematicUploaded(true);
                setIsSchematicError(false);
                // Add further logic to handle the file upload if necessary
            } else {
                setIsSchematicUploaded(false);
                setIsSchematicError(true);
            }
        }
    }

    if (loading && !showFinalMessage) {
        return (
            <div className="loading">
                <LoadingAnimation />
                <h1>Your schematic is being uploaded!</h1>
                <h4>Wait some time</h4>
            </div>
        );
    }

    if (showFinalMessage) {
        return (
            <div className="final-message">
                <LoadingSuccess />
            </div>
        );
    }

    return (
        <div className="container">
            <h1>Let's upload a schematic!</h1>

            <div className="boxes">
                <div className="upload-screenshot">
                    <img src={uploadedImage} alt="" className="schematic-uploaded-image" /> <br />
                    <label htmlFor="uploadScreenshotButton" className="upload-screenshot-button">Choose File</label>
                    <input type="file" id="uploadScreenshotButton" hidden onChange={handleChange} />
                    <h4 className="schematic-box-title">Upload schematic's screenshot</h4>
                </div>
                <div className="boxes-in-boxes">
                    <div className="upload-schematic">
                        <h4 className="schematic-box-title">Upload a schematic (.nbt)</h4>
                        <label htmlFor="uploadSchematicButton" className="upload-schematic-button">Choose File</label>
                        <input type="file" id="uploadSchematicButton" hidden onChange={handleSchematicChange} />
                        {isSchematicUploaded && <img src={checkmark} alt="Upload successful" className="checkmark visible" />}
                        {isSchematicError && <img src={xmark} alt="Error when uploading" className="checkmark visible" />}
                    </div>

                    <div className="blocks-needed">
                        <h4 className="schematic-box-title">List of blocks</h4>
                        <span className="needed-blocks-text">Needed blocks: <br />Placeholder 1 <br />Placeholder 2</span>
                    </div>

                    <div className="schematic-author">
                        <h4>Author: Joe Biden</h4>
                    </div>

                    <div className="upload-text">
                        <h4 className="schematic-box-title">Choose a title and a description</h4>
                        <input type="text" placeholder="Title" className="schematic-choose-text" /> <br />
                        <input type="text" placeholder="Description" className="schematic-choose-text" />
                    </div>
                </div>
            </div>
            <div className="button-div">
                <a href="/schematics" className="nevermind">Nevermind <img src={arrow_left} alt="Nevermind" className="button-image" /></a>
                <a onClick={() => setLoading(true)} className="upload">Upload! <img src={paper_checkmark} alt="Upload" className="button-image" /></a>
            </div>
        </div>
    );
}

export default SchematicsUpload;
