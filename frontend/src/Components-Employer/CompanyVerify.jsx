import React, { useState } from "react";
import { Footer } from "../Components-LandingPage/Footer";
import fileIcon from "../assets/Employer/fileIcon.png"
import "./CompanyVerify.css";
import { EHeader } from "./EHeader";
import { useNavigate } from "react-router-dom";

export const CompanyVerify = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    legalName: "",
    registrationNumber: "",
    taxId: "",
    websiteUrl: "",
    officialEmail: "",
    phoneNumber: "",
    incorporationCertificate: null,
  });

  // Handle all inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];

      // Only allow PDF
      if (file && file.type !== "application/pdf") {
        alert("Only PDF files are allowed!");
        return;
      }

      setFormData({
        ...formData,
        [name]: file,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.incorporationCertificate) {
      alert("Company Incorporation Certificate is required!");
      return;
    }

    console.log("Verification Data Ready:", formData);

    navigate('/Job-portal/Employer/Dashboard', { state: { fromVerify: true } });
  };

  return (
    <div className="verify-page">
      <EHeader />

      <div className="company-verify-container">
        <h2 className="company-verify-title">Company Verify</h2>

        <form className="company-verify-form" onSubmit={handleSubmit}>

          <div className="company-verify-form-group">
            <label>Company Legal Name</label>
            <input
              type="text"
              name="legalName"
              placeholder="e.g., India"
              value={formData.legalName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="company-verify-form-group">
            <label>Registration Number</label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="company-verify-form-group">
            <label>Tax Id / VAT / GST</label>
            <input
              type="text"
              name="taxId"
              placeholder="e.g., 9145******"
              value={formData.taxId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="company-verify-form-group">
            <label>Web Site URL</label>
            <input
              type="text"
              name="websiteUrl"
              placeholder="e.g., https://example.com"
              value={formData.websiteUrl}
              onChange={handleChange}
              required
            />
          </div>

          <div className="company-verify-form-group">
            <label>Official Company Mail Id</label>
            <div className="company-verify-input-with-btn">
              <input
                type="email"
                name="officialEmail"
                placeholder="e.g., hr@example.com"
                value={formData.officialEmail}
                onChange={handleChange}
                required
              />
              <button type="button" className="company-small-verify-btn">
                verify
              </button>
            </div>
          </div>

          <div className="company-verify-form-group">
            <label>Phone Number</label>
            <div className="company-verify-input-with-btn">
              <input
                type="text"
                name="phoneNumber"
                placeholder="e.g., India"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              <button type="button" className="company-small-verify-btn">
                verify
              </button>
            </div>
          </div>

          <div className="company-verify-form-group">
            <label>Company Incorporation Certificate</label>

            <div className="company-verify-file-upload-box">

              <input
                type="file"
                name="incorporationCertificate"
                accept="application/pdf"
                id="pdfUpload"
                onChange={handleChange}
                hidden
              />

              {!formData.incorporationCertificate && (
                <label htmlFor="pdfUpload" className="company-verify-upload-placeholder">
                  <p>Click to Upload File</p>

                </label>
              )}

              {formData.incorporationCertificate && (
                <div className="company-verify-file-preview">

                  <label htmlFor="pdfUpload" className="company-verify-file-left clickable-area">
                    <img src={fileIcon} alt="file" />
                    <div>
                      <p>{formData.incorporationCertificate.name}</p>
                      <span>
                        {(formData.incorporationCertificate.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </label>

                </div>
              )}


            </div>
          </div>


          <div className="company-verify-btn-wrapper">
            <button type="submit" className="company-main-verify-btn">
              Verify
            </button>
          </div>

        </form>
      </div>

      <Footer />
    </div>
  );
};