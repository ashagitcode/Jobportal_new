import React from 'react';
import './ProfileCard.css'; 
import call from '../assets/Employer/Call.png'
import Mail from '../assets/Employer/Email.png'
import Location from '../assets/Employer/Location.png'
import { useNavigate } from 'react-router-dom';

export const ProfileCard = ({ user, showActions = false }) => {
  const navigate=useNavigate();
  if (!user) return null;

  
  const fullName = user.profile?.fullName || "";
  const nameArray = fullName.trim().split(" ");
  const initials = nameArray.length > 1 
    ? (nameArray[0][0] + nameArray[nameArray.length - 1][0]).toUpperCase()
    : (nameArray[0]?.[0] || "U").toUpperCase();

  return (
    <div className="FindTalent-profile-card-container">
      <div className="FindTalent-card-header">
        <div className="FindTalent-name-and-title">
          
          <h1 className="FindTalent-name">{fullName}</h1> 
          
          <p className="FindTalent-job-title">
            {user.currentDetails?.jobTitle} • {user.currentDetails?.experience}
          </p>
        </div>
        
        <div className="FindTalent-profile-image-container">
          <span className="FindTalent-profile-initials">{initials}</span>
        </div>
      </div>

      <div className="FindTalent-contact-info-container">
        
        <div className="FindTalent-contact-item">
          <img src={Mail} alt="Email" className="FindTalent-info-icon" />
          <span>{user.contact?.email}</span> 
        </div>
        
        
        <div className="FindTalent-contact-item">
          <img src={call} alt="Phone" className="FindTalent-info-icon" /> 
          <span>{user.contact?.mobile}</span> 
        </div>
        
        
        <div className="FindTalent-contact-item">
          <img src={Location} alt="Location" className="FindTalent-info-icon" /> 
          <span>
            {user.contact?.city}, {user.contact?.state}
          </span> 
        </div>
      </div>

      
      {showActions && (
        <div className="FindTalent-card-bottom">
                <p className="FindTalent-timestamp">Resume updated: 2 days ago</p>
                <div className="FindTalent-actions">
                  <button className="FindTalent-btn-save">Save</button>
                  <button onClick={()=>{navigate(`/Job-portal/Employer/FindTalent/ProfileOverview/${user.id}`)}} className="FindTalent-btn-view">View profile</button>
                </div>
              </div>
      )}
    </div>
  );
};

