import React from 'react';
import './ProfileCard.css'; 
import call from '../assets/Employer/Call.png'
import Mail from '../assets/Employer/Email.png'
import Location from '../assets/Employer/Location.png'
import { useNavigate } from 'react-router-dom';


export const ProfileCard = ({ user, showActions = false }) => {
  const navigate = useNavigate();
  console.log("user data:",user)
  if (!user) return null;

  const fullName = user.full_name || "Unknown";
  const initials = fullName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  const jobTitle = user.current_job_title || "N/A";
  const experience = user.experience_years || "0";

  const email = user.email || "N/A";
  const phone = user.phone || "N/A";
  const city = user.city || "N/A";
  const state = user.state || "N/A";

  return (
    <div className="FindTalent-profile-card-container">
      <div className="FindTalent-card-header">
        <div className="FindTalent-name-and-title">
          <h1 className="FindTalent-name">{fullName}</h1>
          <p className="FindTalent-job-title">{jobTitle} • {experience} yrs</p>
        </div>

        <div className="FindTalent-profile-image-container">
          <span className="FindTalent-profile-initials">{initials}</span>
        </div>
      </div>

      <div className="FindTalent-contact-info-container">
        <div className="FindTalent-contact-item">
          <img src={Mail} alt="Email" className="FindTalent-info-icon" />
          <span>{email}</span>
        </div>
        <div className="FindTalent-contact-item">
          <img src={call} alt="Phone" className="FindTalent-info-icon" />
          <span>{phone}</span>
        </div>
        <div className="FindTalent-contact-item">
          <img src={Location} alt="Location" className="FindTalent-info-icon" />
          <span>{city}, {state}</span>
        </div>
      </div>

      {showActions && (
        <div className="FindTalent-card-bottom">
          <p className="FindTalent-timestamp">Resume updated: 2 days ago</p>
          <div className="FindTalent-actions">
            <button className="FindTalent-btn-save">Save</button>
            <button
              onClick={() => navigate(`/Job-portal/Employer/FindTalent/ProfileOverview/${user.id}`)}
              className="FindTalent-btn-view"
            >
              View profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};