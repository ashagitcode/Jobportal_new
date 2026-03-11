import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { EHeader } from './EHeader';
import { Footer } from '../Components-LandingPage/Footer';
import time from '../assets/opportunity_time.png';
import experience from '../assets/opportunity_bag.png';
import place from '../assets/opportunity_location.png';
import './PostJobForm.css';
import { useJobs } from '../JobContext';
import starIcon from '../assets/Star_icon.png'

export const EditJob = () => {
  
  const navigate = useNavigate();
  const location = useLocation();
  const { editJob } = useJobs();

  const existingJobData = location.state || null;

  const [selectedStatusType, setSelectedStatusType] = useState(existingJobData?.status?.type || 'reviewing');
  
  const [currentStatus, setCurrentStatus] = useState(existingJobData?.status);

  const statusOptions = [
    { text: 'Hiring in Progress', type: 'progress' },
    { text: 'Reviewing Application', type: 'reviewing' },
    { text: 'Hiring Done', type: 'done' }
  ];


  const handleStatusChange = (e) => {
    setSelectedStatusType(e.target.value);
  };

  const handleSubmit = () => {
    const newStatus = statusOptions.find(opt => opt.type === selectedStatusType);
    setCurrentStatus(newStatus);
    editJob(existingJobData.id, { status: newStatus });

    alert("Status updated successfully!");
    setTimeout(()=>{
    navigate('/Job-portal/Employer/Dashboard')
    },5000)
  };

  if (!existingJobData) return <div>No Job Data Found</div>;

  const logoContent = existingJobData.logo ?
    (<img src={existingJobData.logo} alt={existingJobData.company} className="Opportunities-job-logo" />) :
    (<div className="Opportunities-job-logo-placeholder">{existingJobData.company.charAt(0).toUpperCase()}</div>);

  return (
    <>
      <EHeader />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "100px", minHeight: "80vh" }}>
        <div> <h2>Update Job Status</h2> </div>
        <div style={{ width: "50%" }} className="Opportunities-job-card">
          <div className="Opportunities-job-header">
            <div>
              <h3 className="Opportunities-job-title">{existingJobData.title}</h3>
              <p className="Opportunities-job-company">
              {existingJobData.company} <span className="Opportunities-divider">|</span>
              <span className="star"><img src={starIcon} alt="star" /></span> {existingJobData.ratings}
              <span className="Opportunities-divider">|</span>
              <span className="opp-reviews"> {existingJobData.reviewNo} Reviews</span>
            </p>
            </div>
            {logoContent}
          </div>

          <div className="Opportunities-job-details">
            <p className='Opportunities-detail-line'><img src={time} className='card-icons' alt="time" />{existingJobData.duration}<span className="Opportunities-divider">|</span>₹ {existingJobData.salary} Lpa</p>
            <p className='Opportunities-detail-line'><img src={experience} className='card-icons' alt="exp" />{existingJobData.experience} years of experience</p>
            <p className='Opportunities-detail-line'><img src={place} className='card-icons' alt="loc" />{existingJobData.location}</p>
          </div>

          <div className='Opportunities-details-bottom'>
            <div className="Opportunities-job-tags">
              {existingJobData.tags.map((tag, index) => (
                <span key={index} className={`Opportunities-job-tag ${tag.toLowerCase()}`}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="Opportunities-job-type">
              {existingJobData.WorkType}
            </div>
          </div>

          <hr className="Opportunities-separator" />

          <div className='applied-app-status-container'>
            <span className={`applied-application-status status-${currentStatus.type}`}>
              {currentStatus.text}
            </span>
          </div>
        </div>

        <div style={{ marginTop: "30px", textAlign: "center", width: "50%" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "10px" }}>Update Job Status:</label>
          <select
            value={selectedStatusType}
            onChange={handleStatusChange}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc", width: "100%", cursor: "pointer", marginBottom: "20px" }}
          >
            {statusOptions.map((opt) => (
              <option key={opt.type} value={opt.type}>
                {opt.text}
              </option>
            ))}
          </select>

          <button
            onClick={handleSubmit}
            style={{ padding: "12px 30px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>
            Submit Changes
          </button>
        </div>

      </div>
      <Footer />
    </>
  );
};