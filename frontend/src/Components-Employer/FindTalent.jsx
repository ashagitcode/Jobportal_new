import React, { useMemo, useState,useEffect } from 'react';
import './FindTalent.css';
import UserIcon from '../assets/Employer/User.png'
import { EHeader } from './EHeader';
import { useJobs } from '../JobContext';
import { useNavigate } from 'react-router-dom';
import { ProfileCard } from './ProfileCard';





export const FindTalent = () => {
  // States for Filters
  const { Alluser } = useJobs();

  // ADD THIS TEMPORARY CONSOLE LOG
  console.log("Alluser in FindTalent:", Alluser);
  if (Alluser && Alluser.length > 0) {
    console.log("First user structure:", Alluser[0]);
  }

 





  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  // const [selectedWorkTypes, setSelectedWorkTypes] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedEdu, setSelectedEdu] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [maxExp, setMaxExp] = useState(10);

  // States for "View More" toggles
  const [showAllLangs, setShowAllLangs] = useState(false);
  const [showAllEdu, setShowAllEdu] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);




  // --- Dynamic Data Extraction ---
  const filterOptions = useMemo(() => {
  const languages = new Set();
  const education = new Set();
  const skills = new Set();

  Alluser.forEach(user => {
    if (user.preferences?.[0]?.jobType) {
      // workTypes.add(user.preferences[0].jobType);
    }

    user.languages?.forEach(lang => languages.add(lang.name));
    if (user.education?.highestQual) education.add(user.education.highestQual);
    user.skills?.forEach(skill => skills.add(skill));
  });

  return {
    // workTypes: Array.from(workTypes),
    languages: Array.from(languages),
    education: Array.from(education),
    skills: Array.from(skills),
  };
}, [Alluser]);

  const handleFilterChange = (value, state, setState) => {
    setState(state.includes(value) ? state.filter(i => i !== value) : [...state, value]);
  };

  const filteredTalent = useMemo(() => {
  return Alluser.filter((user) => {

    const matchesSearch =
      searchTerm === '' ||
      user.skills?.some(s =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      user.education?.highestQual?.toLowerCase()
        ?.includes(searchTerm.toLowerCase());

    const matchesLanguage =
      selectedLanguages.length === 0 ||
      user.languages?.some(lang =>
        selectedLanguages.includes(lang.name)
      );

    const matchesEducation =
      selectedEdu.length === 0 ||
      selectedEdu.includes(user.education?.highestQual);

    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.every(skill =>
        user.skills?.includes(skill)
      );

    const expNumber =
  user.experience_years === null || user.experience_years === "Fresher"
    ? 0
    : parseFloat(user.experience_years);

const matchesExperience = expNumber <= maxExp;
    return (
      matchesSearch &&
      matchesLanguage &&
      matchesEducation &&
      matchesSkills &&
      matchesExperience
    );
  });
}, [Alluser, searchTerm, selectedLanguages, selectedEdu, selectedSkills, maxExp]);
  //selectedWorkTypes

  // Helper function to slice data based on toggle
  const getVisibleItems = (items, showAll) => showAll ? items : items.slice(0, 3);

  return (
    <>
      {/* <EHeader /> */}
      <div className="talent-page-container">
        <section  className="FindTalent-search-section"> 
          <div className="FindTalent-search-wrapper">
            <input
              type="text"
              placeholder="Search by Skills and Education"
              className="FindTalent-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="FindTalent-search-button">Search</button>
          </div>
          <h1 style={{ marginTop: "40px" }} className="FindTalent-results-title">Jobseekers based on your search</h1>
        </section>

        <div className="FindTalent-layout-body">
          <div className="FindTalent-filters-sidebar">
            <div className="FindTalent-filter-top">
              <span className="FindTalent-filter-label">Apply filters</span>
              <span className="FindTalent-clear-btn" onClick={() => {
                 setSelectedLanguages([]); setSelectedEdu([]); setSelectedSkills([]); setMaxExp(10); setSearchTerm('');
              }}>Clear filter</span>
            </div>

            
            {/* <div className="FindTalent-filter-category">
            <h3>Work Type</h3>
            {filterOptions.workTypes.map(type => (
              <div key={type} className="FindTalent-checkbox-item">
                <input type="checkbox" checked={selectedWorkTypes.includes(type)} onChange={() => handleFilterChange(type, selectedWorkTypes, setSelectedWorkTypes)} /> {type}
              </div>
            ))}
          </div> */}

            {/* Languages with View More */}
            <div className="FindTalent-filter-category">
              <h3>Languages</h3>
              {getVisibleItems(filterOptions.languages, showAllLangs).map(lang => (
                <div key={lang} className="FindTalent-checkbox-item">
                  <input type="checkbox" checked={selectedLanguages.includes(lang)} onChange={() => handleFilterChange(lang, selectedLanguages, setSelectedLanguages)} /> {lang}
                </div>
              ))}
              {filterOptions.languages.length > 3 && (
                <span className="FindTalent-view-more-link" onClick={() => setShowAllLangs(!showAllLangs)}>
                  {showAllLangs ? "View Less" : "View More"}
                </span>
              )}
            </div>

            <div className="FindTalent-filter-category">
              <h3>Experiance</h3>
              <input type="range" min="0" max="10" value={maxExp} onChange={(e) => setMaxExp(e.target.value)} className="FindTalent-exp-slider" />
            </div>

            {/* Education with View More */}
            <div className="FindTalent-filter-category">
              <h3>Education</h3>
              {getVisibleItems(filterOptions.education, showAllEdu).map(edu => (
                <div key={edu} className="FindTalent-checkbox-item">
                  <input type="checkbox" checked={selectedEdu.includes(edu)} onChange={() => handleFilterChange(edu, selectedEdu, setSelectedEdu)} /> {edu}
                </div>
              ))}
              {filterOptions.education.length > 3 && (
                <span className="FindTalent-view-more-link" onClick={() => setShowAllEdu(!showAllEdu)}>
                  {showAllEdu ? "View Less" : "View More"}
                </span>
              )}
            </div>

            {/* Skills with View More */}
            <div className="FindTalent-filter-category">
              <h3>Skills</h3>
              {getVisibleItems(filterOptions.skills, showAllSkills).map(skill => (
                <div key={skill} className="FindTalent-checkbox-item">
                  <input type="checkbox" checked={selectedSkills.includes(skill)} onChange={() => handleFilterChange(skill, selectedSkills, setSelectedSkills)} /> {skill}
                </div>
              ))}
              {filterOptions.skills.length > 3 && (
                <span className="FindTalent-view-more-link" onClick={() => setShowAllSkills(!showAllSkills)}>
                  {showAllSkills ? "View Less" : "View More"}
                </span>
              )}
            </div>
          </div>

          <div className="FindTalent-talent-list">
            {/* <h3>{filteredTalent.length}</h3> */}
            {/* {filteredTalent.map((user, index) => (
            <div className="FindTalent-talent-card" key={index}>
              <div className="FindTalent-card-top">
                <div className="FindTalent-info-area">
                  <h2>{user.profile.fullName} <small>({user.currentDetails.experience})</small></h2>
                  <div className="FindTalent-meta-grid">
                    <span>{user.education.graduations[0]?.startYear}-{user.education.graduations[0]?.endYear} Batch</span>
                    <span>{user.education.graduations[0]?.degree}</span>
                    <span>Project: {user.experience.entries[0]?.responsibilities || "N/A"}</span>
                    <span>Skills: {user.skills.join(", ")}</span>
                  </div>
                </div>
                <div className="FindTalent-avatar">
                  <img src={UserIcon} alt='profile' />
                </div>
              </div>
              <div className="FindTalent-card-bottom">
                <p className="FindTalent-timestamp">Resume updated: 2 days ago</p>
                <div className="FindTalent-actions">
                  <button className="FindTalent-btn-save">Save</button>
                  <button onClick={navigate('/Job-portal/Employer/FindTalent/ProfileOverview')} className="FindTalent-btn-view">View profile</button>
                </div>
              </div>
            </div>
          ))} */}

            {filteredTalent.map((user, index) => (
              <ProfileCard key={index} user={user} showActions='true' />)
              )}
            {filteredTalent.length > 0 && <button className="FindTalent-load-more-btn">View more</button>}
          </div>
        </div>
      </div>
    </>
  );
};

