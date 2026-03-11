import React, { useState } from "react";
// import { JHeader } from "../Components-Jobseeker/JHeader";
import { Footer } from "../Components-LandingPage/Footer";
import "./AboutYourCompany.css";
import fileIcon from "../assets/Employer/fileIcon.png"
import { useNavigate } from "react-router-dom";
import { useJobs } from "../JobContext";
import { EHeader } from "./EHeader";



export const AboutYourCompany = () => {

    const navigate = useNavigate();
    const { setCompanyProfile } = useJobs();

    const [formData, setFormData] = useState({
        companyName: "",
        companyMoto: "",
        contactPerson: "",
        contactNumber: "",
        companyMail: "",
        website: "",
        companySize: "",
        address1: "",
        address2: "",
        about: "",
        companyLogo: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            const file = files[0];

            const allowedTypes = [
                "image/png",
                "image/jpeg",
                "image/jpg",
                "image/webp"
            ];

            if (!allowedTypes.includes(file.type)) {
                alert("Only image files (PNG, JPG, JPEG, WEBP) are allowed!");
                return;
            }

            setFormData({
                ...formData,
                [name]: file
            });

        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        setCompanyProfile({
            companyName: formData.companyName,
            about: formData.about,
            website: formData.website,
            companyLogo: formData.companyLogo 
        });

        console.log("Form Data Ready for Backend:", formData);

        navigate("/Job-portal/Employer/about-your-company/company-verification");
    };

    return (
        <div>
            <EHeader />

            <div className="aboutcompany-container">
                <h2 className="aboutcompany-title">About Your Company</h2>

                <form className="aboutcompany-form" onSubmit={handleSubmit}>

                    <div className="aboutcompany-form-group">
                        <label>Company Name</label>
                        <input
                            type="text"
                            name="companyName"
                            placeholder="e.g., job portal"
                            value={formData.companyName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="aboutcompany-form-group">
                        <label>Company Moto</label>
                        <input
                            type="text"
                            name="companyMoto"
                            value={formData.companyMoto}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="aboutcompany-form-group">
                        <label>Contact Person</label>
                        <input
                            type="text"
                            name="contactPerson"
                            placeholder="e.g., vijay"
                            value={formData.contactPerson}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="aboutcompany-form-group">
                        <label>Contact Number</label>
                        <input
                            type="text"
                            name="contactNumber"
                            placeholder="e.g., 9145******"
                            value={formData.contactNumber}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="aboutcompany-form-group">
                        <label>Company Mail Id</label>
                        <input
                            type="email"
                            name="companyMail"
                            placeholder="e.g., hr@example.com"
                            value={formData.companyMail}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="aboutcompany-form-group">
                        <label>Company Web Site</label>
                        <input
                            type="text"
                            name="website"
                            placeholder="e.g., https://example.com"
                            value={formData.website}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="aboutcompany-form-group">
                        <label>Company Logo</label>

                        <div className="aboutcompany-file-upload-box">

                            {/* Hidden Input */}
                            <input
                                type="file"
                                name="companyLogo"
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                id="logoUpload"
                                onChange={handleChange}
                                hidden
                            />

                            {/* If No File */}
                            {!formData.companyLogo && (
                                <label htmlFor="logoUpload" className="aboutcompany-upload-placeholder">
                                    Click to Upload Logo
                                </label>
                            )}

                            {/* If File Selected */}
                            {formData.companyLogo && (
                                <div className="aboutcompany-file-preview">

                                    <label htmlFor="logoUpload" className="aboutcompany-file-left clickable-area">
                                        <img src={fileIcon} alt="file" />

                                        <div>
                                            <p>{formData.companyLogo.name}</p>
                                            <span>
                                                {(formData.companyLogo.size / 1024 / 1024).toFixed(2)} MB
                                            </span>
                                        </div>
                                    </label>

                                </div>
                            )}

                        </div>
                    </div>


                    <div className="aboutcompany-form-group">
                        <label>Company Size</label>
                        <input
                            type="text"
                            name="companySize"
                            placeholder="e.g., startup"
                            value={formData.companySize}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="aboutcompany-form-group">
                        <label>Company Address</label>
                        <input
                            type="text"
                            name="address1"
                            placeholder="e.g., India"
                            value={formData.address1}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="aboutcompany-form-group">
                        <label>Company Address 2</label>
                        <input
                            type="text"
                            name="address2"
                            placeholder="e.g., India"
                            value={formData.address2}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="aboutcompany-form-group">
                        <label>About Company</label>
                        <textarea
                            rows="5"
                            name="about"
                            value={formData.about}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="aboutcompany-form-buttons">
                        <button type="button" className="aboutcompany-back-btn">Back</button>
                        <button type="submit" className="aboutcompany-next-btn">Next</button>
                    </div>

                </form>
            </div>

            <Footer />
        </div>
    );
};