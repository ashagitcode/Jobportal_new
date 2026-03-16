import React, { useMemo, useState } from "react";
import "./FindTalent.css";
import { useJobs } from "../JobContext";
import { useNavigate } from "react-router-dom";
import { ProfileCard } from "./ProfileCard";
import api from "../api/axios";

export const FindTalent = () => {
  const { Alluser, startConversation } = useJobs();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedEdu, setSelectedEdu] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [maxExp, setMaxExp] = useState(10);

  const [showAllLangs, setShowAllLangs] = useState(false);
  const [showAllEdu, setShowAllEdu] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);

  /* ---------------- FILTER OPTIONS ---------------- */

  const filterOptions = useMemo(() => {
    const languages = new Set();
    const education = new Set();
    const skills = new Set();

    Alluser?.forEach((user) => {
      user.languages?.forEach((lang) => {
        if (lang.name) languages.add(lang.name);
      });

      user.skills?.forEach((skill) => {
        if (skill.name) skills.add(skill.name);
      });

      user.educations?.forEach((edu) => {
        if (edu.degree) education.add(edu.degree);
      });
    });

    return {
      languages: Array.from(languages),
      education: Array.from(education),
      skills: Array.from(skills),
    };
  }, [Alluser]);

  /* ---------------- FILTER HANDLER ---------------- */

  const handleFilterChange = (value, state, setState) => {
    setState(
      state.includes(value)
        ? state.filter((item) => item !== value)
        : [...state, value]
    );
  };

  /* ---------------- FILTERED TALENT ---------------- */

  const filteredTalent = useMemo(() => {
    return Alluser?.filter((user) => {
      const userSkills = user.skills?.map((s) => s.name) || [];
      const userLanguages = user.languages?.map((l) => l.name) || [];
      const userEducation = user.educations?.map((e) => e.degree) || [];

      const matchesSearch =
        searchTerm === "" ||
        userSkills.some((s) =>
          s.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        userEducation.some((e) =>
          e?.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesLanguage =
        selectedLanguages.length === 0 ||
        userLanguages.some((lang) => selectedLanguages.includes(lang));

      const matchesEducation =
        selectedEdu.length === 0 ||
        userEducation.some((edu) => selectedEdu.includes(edu));

      const matchesSkills =
        selectedSkills.length === 0 ||
        selectedSkills.every((skill) => userSkills.includes(skill));

      const expNumber = parseFloat(user.total_experience_years || 0);
      const matchesExperience = expNumber <= maxExp;

      return (
        matchesSearch &&
        matchesLanguage &&
        matchesEducation &&
        matchesSkills &&
        matchesExperience
      );
    });
  }, [
    Alluser,
    searchTerm,
    selectedLanguages,
    selectedEdu,
    selectedSkills,
    maxExp,
  ]);

  const getVisibleItems = (items, showAll) =>
    showAll ? items : items.slice(0, 3);

  /* ---------------- UI ---------------- */


  // Add this before the return to see the data structure
console.log("Alluser sample:", Alluser?.map(u => ({
  profileId: u.id,
  userId: u.user?.id,
  user_id: u.user_id,
  name: u.full_name
})));

  return (
    <div className="talent-page-container">
      {/* SEARCH */}

      <section className="FindTalent-search-section">
        <div className="FindTalent-search-wrapper">
          <input
            type="text"
            placeholder="Search by Skills or Education"
            className="FindTalent-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="FindTalent-search-button">Search</button>
        </div>

        <h1 className="FindTalent-results-title">
          Jobseekers based on your search
        </h1>
      </section>

      <div className="FindTalent-layout-body">
        {/* ---------------- FILTER SIDEBAR ---------------- */}

        <div className="FindTalent-filters-sidebar">
          <div className="FindTalent-filter-top">
            <span className="FindTalent-filter-label">Apply Filters</span>

            <span
              className="FindTalent-clear-btn"
              onClick={() => {
                setSelectedLanguages([]);
                setSelectedEdu([]);
                setSelectedSkills([]);
                setMaxExp(10);
                setSearchTerm("");
              }}
            >
              Clear filter
            </span>
          </div>

          {/* LANGUAGES */}

          <div className="FindTalent-filter-category">
            <h3>Languages</h3>

            {getVisibleItems(filterOptions.languages, showAllLangs).map(
              (lang) => (
                <div key={lang} className="FindTalent-checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedLanguages.includes(lang)}
                    onChange={() =>
                      handleFilterChange(
                        lang,
                        selectedLanguages,
                        setSelectedLanguages
                      )
                    }
                  />
                  {lang}
                </div>
              )
            )}

            {filterOptions.languages.length > 3 && (
              <span
                className="FindTalent-view-more-link"
                onClick={() => setShowAllLangs(!showAllLangs)}
              >
                {showAllLangs ? "View Less" : "View More"}
              </span>
            )}
          </div>

          {/* EXPERIENCE */}

          <div className="FindTalent-filter-category">
            <h3>Experience</h3>

            <input
              type="range"
              min="0"
              max="10"
              value={maxExp}
              onChange={(e) => setMaxExp(e.target.value)}
              className="FindTalent-exp-slider"
            />

            <p>{maxExp} Years</p>
          </div>

          {/* EDUCATION */}

          <div className="FindTalent-filter-category">
            <h3>Education</h3>

            {getVisibleItems(filterOptions.education, showAllEdu).map(
              (edu) => (
                <div key={edu} className="FindTalent-checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedEdu.includes(edu)}
                    onChange={() =>
                      handleFilterChange(edu, selectedEdu, setSelectedEdu)
                    }
                  />
                  {edu}
                </div>
              )
            )}

            {filterOptions.education.length > 3 && (
              <span
                className="FindTalent-view-more-link"
                onClick={() => setShowAllEdu(!showAllEdu)}
              >
                {showAllEdu ? "View Less" : "View More"}
              </span>
            )}
          </div>

          {/* SKILLS */}

          <div className="FindTalent-filter-category">
            <h3>Skills</h3>

            {getVisibleItems(filterOptions.skills, showAllSkills).map(
              (skill) => (
                <div key={skill} className="FindTalent-checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill)}
                    onChange={() =>
                      handleFilterChange(
                        skill,
                        selectedSkills,
                        setSelectedSkills
                      )
                    }
                  />
                  {skill}
                </div>
              )
            )}

            {filterOptions.skills.length > 3 && (
              <span
                className="FindTalent-view-more-link"
                onClick={() => setShowAllSkills(!showAllSkills)}
              >
                {showAllSkills ? "View Less" : "View More"}
              </span>
            )}
          </div>
        </div>

        {/* ---------------- TALENT LIST ---------------- */}

        <div className="FindTalent-talent-list">
          {filteredTalent?.map((user, index) => (
            // <ProfileCard key={index} user={user} showActions={true} onChat={()=>startConversation(user.id)} />
            // CORRECT code:
            <ProfileCard
              key={index}
              user={user}
              showActions={true}
              onChat={() => startConversation(user.user?.id || user.user_id)}  // ← FIX: send actual user ID
            />
          ))}

          {filteredTalent?.length > 0 && (
            <button className="FindTalent-load-more-btn">View more</button>
          )}
        </div>
      </div>
    </div>
  );
};