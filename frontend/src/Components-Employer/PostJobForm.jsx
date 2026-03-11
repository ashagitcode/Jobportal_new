import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EHeader } from './EHeader';
import { Footer } from '../Components-LandingPage/Footer';
import './PostJobForm.css';

export const PostJobForm = () => {
  const navigate = useNavigate();

  const categoryOptions = ["Aerospace & Defense", "Ai/MI", "Analytics", "Artificial Intelligence", "Automotive", "Big Data", "Biotechnology", "Business Consulting", "Business Intelligence", "Cloud Computing", "Cloud Services", "Construction", "Consulting", "Consumer Goods", "Consumer Tech", "Corporate", "Corporate Functions", "Customer Support", "Cybersecurity", "Data Infrastructure", "Data Science", "Design", "Digital Marketing", "Digital Media", "E-Commerce", "Ed-Tech", "Energy", "Enterprise Software", "Entertainment", "Finance", "Financial Services", "Fintech", "Fmcg", "Healthcare", "Hospital", "Hr Services", "Human Resources", "Internet", "It Consulting", "It Networking", "IT Services", "Logistics", "Marketing", "Marketing & Advertising", "Martech", "Mobile App Development", "Mobile Development", "Pharmaceutical", "Pharma", "Product Development", "Project Management", "Real Estate", "Recruitment", "Regional Sales", "Renewable Power", "Research", "Retail", "Retail Tech", "Saas", "Sales", "Site Reliability Engineering", "Software Development", "Software Product", "Software Testing", "Subscription Service", "Supply Chain", "Technology", "Telecommunications"];
  const educationOptions = [
    "BS", "B.A", "CA", "B.Ed", "M.Com", "B.Sc", "MCA", "BCA", "LLM", "MS/M.Sc", "Diploma", "B.Com", "M.Tech", "MBA/PGDM", "PG Diploma", "B.B.A/ B.M.S", "Medical-MS/MD", "B.Tech/B.E.", "Any Graduate", "Other Post Graduate", "ITI Certification", "Any Postgraduate", "Graduation Not Required", "Post Graduation Not Required", "Bachelor Of Science", "Business Economics"
  ];
  const departmentOptions = [
    "Engineering", "Marketing", "Sales", "Human Resources", "Finance",
    "Operations", "Product Management", "Customer Success", "Design",
    "Data Science", "Legal", "Information Technology", "Administrative"
  ];

  const [formData, setFormData] = useState({
    jobTitle: '',
    category: [],
    department: [],
    education: [],
    workType: '',
    shift: '',
    workDuration: '',
    salary: '',
    experience: '',
    location: '',
    openings: '',
    jobCategory: [],
    keySkills: [''],
    jobHighlights: [''],
    jobDescription: '',
    responsibilities: ['']
  });
  console.log(formData)

  const [skillsList, setSkillsList] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [errors, setErrors] = useState({});

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job title is required";
    if (formData.category.length === 0) newErrors.category = "Industrial type is required";
    if (formData.department.length === 0) newErrors.department = "Department is required";
    if (!formData.workType) newErrors.workType = "Work type is required";
    if (!formData.shift) newErrors.shift = "Shift is required";
    if (!formData.workDuration.trim()) newErrors.workDuration = "Work duration is required";
    if (!formData.salary.trim()) newErrors.salary = "Salary is required";
    if (!formData.experience.trim()) newErrors.experience = "Experience is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.openings.trim()) newErrors.openings = "Openings are required";
    if (!formData.jobCategory) newErrors.jobCategory = "Job category is required";
    if (formData.education.length === 0) newErrors.education = "Education is required";
    if (skillsList.length === 0) newErrors.keySkills = "At least one key skill is required";
    if (!formData.jobHighlights[0].trim()) newErrors.jobHighlights = "At least one highlight is required";
    if (!formData.jobDescription.trim()) newErrors.jobDescription = "Job description is required";
    if (!formData.responsibilities[0].trim()) newErrors.responsibilities = "At least one responsibility is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckboxChange = (name, value, allOptions = []) => {
    setErrors({ ...errors, [name]: "" });
    setFormData(prev => {
      const currentList = prev[name] || [];
      if (value === "all") {
        const isAllSelected = currentList.length === allOptions.length;
        return { ...prev, [name]: isAllSelected ? [] : allOptions };
      }
      const newList = currentList.includes(value)
        ? currentList.filter(i => i !== value)
        : [...currentList, value];
      return { ...prev, [name]: newList };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setErrors({ ...errors, [name]: "" });

    if (type === 'checkbox') {
      if (name.includes('.')) {
        const [group, field] = name.split('.');
        setFormData((prev) => ({
          ...prev,
          [group]: { ...prev[group], [field]: checked }
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newSkill = formData.keySkills.trim();
      if (newSkill && !skillsList.includes(newSkill)) {
        setSkillsList([...skillsList, newSkill]);
         setFormData({ ...formData, keySkills: '' });
        setErrors({ ...errors, keySkills: "" });
      }
      
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkillsList(skillsList.filter(skill => skill !== skillToRemove));
  };

  const handleHighlightChange = (index, value) => {
    const newHighlights = [...formData.jobHighlights];
    newHighlights[index] = value;
    setFormData({ ...formData, jobHighlights: newHighlights });
    setErrors({ ...errors, jobHighlights: "" });
  };

  const addHighlightField = () => {
    setFormData({
      ...formData,
      jobHighlights: [...formData.jobHighlights, ""]
    });
  };

  const handleResponsibilityChange = (index, value) => {
    const updatedRes = [...formData.responsibilities];
    updatedRes[index] = value;
    setFormData({ ...formData, responsibilities: updatedRes });
    setErrors({ ...errors, responsibilities: "" });
  };

  const addResponsibilityField = () => {
    setFormData({
      ...formData,
      responsibilities: [...formData.responsibilities, ""]
    });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      return false; // stops form submit if errors
    }
    const submissionData = {
      ...formData,
      skills: skillsList
    };
    navigate('/Job-portal/Employer/PostJobpreview', { state: submissionData });
  };

  return (
    <div className="jobpost-page-title">
      {/* <EHeader /> */}
      <main className="jobpost-main-content">
        <header className="jobpost-form-header">
          <h1>Post a Job</h1>
          <p>Complete the steps below to reach thousands of qualified candidates</p>
        </header>

        <div className="jobpost-form-container">
          <form className="jobpost-form" onSubmit={handleSubmit}>
            <div className="jobpost-form-row">
              <label className="jobpost-label">Job title</label>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <input className={`jobpost-input ${errors.jobTitle ? "input-error" : ""}`} type="text" name="jobTitle" placeholder="e.g., Fullstack Developer" value={formData.jobTitle} onChange={handleChange} />
                {errors.jobTitle && <span className="error-msg">{errors.jobTitle}</span>}
              </div>
            </div>

            <div className="jobpost-form-row jobpost-top-align">
              <label className="jobpost-label">Industrial type</label>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className={`jobpost-dropdown ${openDropdown === 'category' ? 'jobpost-is-active' : ''} ${errors.category ? "input-error" : ""}`}>
                  <div className="jobpost-dropdown-trigger" onClick={() => toggleDropdown('category')}>
                    {formData.category.length > 0 ? formData.category.join(', ') : 'Select'}
                    <i className="fas fa-angle-down jobpost-arrow"></i>
                  </div>
                  <div className="jobpost-dropdown-panel">
                    <label className="jobpost-select-all">
                      <input type="checkbox" onChange={() => handleCheckboxChange('category', 'all', categoryOptions)}
                        checked={formData.category.length === categoryOptions.length && categoryOptions.length > 0} />
                      <strong>Select all</strong>
                    </label>
                    <div className="jobpost-options-grid">
                      {categoryOptions.map(cat => (
                        <label key={cat} className="jobpost-option-item">
                          <input type="checkbox" checked={formData.category.includes(cat)} onChange={() => handleCheckboxChange('category', cat)} /> {cat}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                {errors.category && <span className="error-msg">{errors.category}</span>}
              </div>
            </div>

            <div className="jobpost-form-row jobpost-top-align">
              <label className="jobpost-label">Department</label>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className={`jobpost-dropdown ${openDropdown === 'department' ? 'jobpost-is-active' : ''} ${errors.department ? "input-error" : ""}`}>
                  <div className="jobpost-dropdown-trigger" onClick={() => toggleDropdown('department')}>
                    {formData.department.length > 0 ? formData.department.join(', ') : 'Select'}
                    <i className="fas fa-angle-down jobpost-arrow"></i>
                  </div>
                  <div className="jobpost-dropdown-panel">
                    <label className="jobpost-select-all">
                      <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange('department', 'all', departmentOptions)}
                        checked={formData.department.length === departmentOptions.length}
                      />
                      <strong>Select all Departments</strong>
                    </label>
                    <div className="jobpost-options-grid">
                      {departmentOptions.map(dept => (
                        <label key={dept} className="jobpost-option-item">
                          <input
                            type="checkbox"
                            checked={formData.department.includes(dept)}
                            onChange={() => handleCheckboxChange('department', dept)}
                          />
                          {dept}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                {errors.department && <span className="error-msg">{errors.department}</span>}
              </div>
            </div>

            <div className="jobpost-form-row">
              <label className="jobpost-label">Work type</label>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className={`jobpost-radio-container ${errors.workType ? "input-error" : ""}`}>
                  <label className="jobpost-radio-label">
                    <input type="radio" name="workType" value="Hybrid" checked={formData.workType === 'Hybrid'} onChange={handleChange} /> Hybrid
                  </label>
                  <label className="jobpost-radio-label">
                    <input type="radio" name="workType" value="Remote" checked={formData.workType === 'Remote'} onChange={handleChange} /> Remote
                  </label>
                  <label className="jobpost-radio-label">
                    <input type="radio" name="workType" value="On-site" checked={formData.workType === 'On-site'} onChange={handleChange} /> On-site
                  </label>
                </div>
                {errors.workType && <span className="error-msg">{errors.workType}</span>}
              </div>
            </div>

            <div className="jobpost-form-row">
              <label className="jobpost-label">Shift</label>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className={`jobpost-radio-container ${errors.shift ? "input-error" : ""}`}>
                  <label className="jobpost-radio-label">
                    <input type="radio" name="shift" value="General" checked={formData.shift === 'General'} onChange={handleChange} /> General
                  </label>
                  <label className="jobpost-radio-label">
                    <input type="radio" name="shift" value="Night" checked={formData.shift === 'Night'} onChange={handleChange} /> Night
                  </label>
                  <label className="jobpost-radio-label">
                    <input type="radio" name="shift" value="Rotational" checked={formData.shift === 'Rotational'} onChange={handleChange} /> Rotational
                  </label>
                </div>
                {errors.shift && <span className="error-msg">{errors.shift}</span>}
              </div>
            </div>

            <div className="jobpost-form-row">
              <label className="jobpost-label">Work duration</label>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <input className={`jobpost-input ${errors.workDuration ? "input-error" : ""}`} type="text" name="workDuration" placeholder='e.g., "3 Months", "6 Months", "permanent"' value={formData.workDuration} onChange={handleChange} />
                {errors.workDuration && <span className="error-msg">{errors.workDuration}</span>}
              </div>
            </div>

            <div className="jobpost-form-row">
              <label className="jobpost-label">Salary</label>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <input className={`jobpost-input ${errors.salary ? "input-error" : ""}`} type="text" name="salary" placeholder="Max Annual CTC in LPA" value={formData.salary} onChange={handleChange} />
                {errors.salary && <span className="error-msg">{errors.salary}</span>}
              </div>
            </div>

            <div className="jobpost-form-row">
              <label className="jobpost-label">Experience</label>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <input className={`jobpost-input ${errors.experience ? "input-error" : ""}`} type="text" name="experience" placeholder="Minimum years required" value={formData.experience} onChange={handleChange} />
                {errors.experience && <span className="error-msg">{errors.experience}</span>}
              </div>
            </div>

            <div className="jobpost-form-row">
              <label className="jobpost-label">Location</label>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <input className={`jobpost-input ${errors.location ? "input-error" : ""}`} type="text" name="location" placeholder="City name (e.g., Bengaluru)" value={formData.location} onChange={handleChange} />
                {errors.location && <span className="error-msg">{errors.location}</span>}
              </div>
            </div>

            <div className="jobpost-form-row">
              <label className="jobpost-label">Openings</label>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <input className={`jobpost-input ${errors.openings ? "input-error" : ""}`} type="text" name="openings" placeholder="Total vacant positions" value={formData.openings} onChange={handleChange} />
                {errors.openings && <span className="error-msg">{errors.openings}</span>}
              </div>
            </div>

            <div className="jobpost-form-row">
              <label className="jobpost-label">Job category</label>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className={`jobpost-radio-container ${errors.jobCategory ? "input-error" : ""}`}>
                  <label className="jobpost-radio-label">
                    <input type="radio" name="jobCategory" value="Full-time" checked={formData.jobCategory === 'Full-time'} onChange={handleChange} /> Full-time
                  </label>
                  <label className="jobpost-radio-label">
                    <input type="radio" name="jobCategory" value="Internship" checked={formData.jobCategory === 'Internship'} onChange={handleChange} /> Internship
                  </label>
                </div>
                {errors.jobCategory && <span className="error-msg">{errors.jobCategory}</span>}
              </div>
            </div>

            <div className="jobpost-form-row jobpost-top-align">
              <label className="jobpost-label">Education</label>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className={`jobpost-dropdown ${openDropdown === 'education' ? 'jobpost-is-active' : ''} ${errors.education ? "input-error" : ""}`}>
                  <div className="jobpost-dropdown-trigger" onClick={() => toggleDropdown('education')}>
                    {formData.education.length > 0 ? formData.education.join(', ') : 'Select Education'}
                    <i className="fas fa-angle-down jobpost-arrow"></i>
                  </div>
                  <div className="jobpost-dropdown-panel">
                    <div className="jobpost-options-grid">
                      {educationOptions.map(edu => (
                        <label key={edu} className="jobpost-option-item">
                          <input type="checkbox" checked={formData.education.includes(edu)} onChange={() => handleCheckboxChange('education', edu)} /> {edu}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                {errors.education && <span className="error-msg">{errors.education}</span>}
              </div>
            </div>

            <div className="jobpost-form-row">
              <label className="jobpost-label">Key skills</label>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className={`jobpost-skills-titile ${errors.keySkills ? "input-error" : ""}`}>
                  <input
                    className="jobpost-input skills-input"
                    style={errors.keySkills ? { borderColor: '#d93025' } : {}}
                    type="text"
                    name="keySkills"
                    placeholder="Press Enter to add skills  (e.g., Python, AWS, React etc...)"
                    value={formData.keySkills}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="jobpost-tags-area" style={errors.keySkills ? { borderColor: '#d93025' } : {}}>
                    {skillsList.map((skill, index) => (
                      <span key={index} className="jobpost-tag">
                        {skill} <button type="button" onClick={() => removeSkill(skill)}>×</button>
                      </span>
                    ))}
                  </div>
                </div>
                {errors.keySkills && <span className="error-msg">{errors.keySkills}</span>}
              </div>
            </div>

            <div className="jobpost-form-row">
              <label className="jobpost-label">Job highlights</label>
              <div className="highlights-container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {formData.jobHighlights.map((highlight, index) => (
                  <div key={index} className="jobpost-input-icon-titile">
                    <input
                      className={`jobpost-input ${errors.jobHighlights && index === 0 ? "input-error" : ""}`}
                      type="text"
                      placeholder="Add top 3-5 selling points of the role"
                      value={highlight}
                      onChange={(e) => handleHighlightChange(index, e.target.value)}
                    />
                    {index === formData.jobHighlights.length - 1 && (
                      <span className="jobpost-plus-icon" onClick={addHighlightField}>+</span>
                    )}
                  </div>
                ))}
                {errors.jobHighlights && <span className="error-msg">{errors.jobHighlights}</span>}
              </div>
            </div>

            <div className="jobpost-form-row">
              <label className="jobpost-label">Job description</label>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <textarea className={`jobpost-textarea ${errors.jobDescription ? "input-error" : ""}`} name="jobDescription" placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity unique.... " value={formData.jobDescription} onChange={handleChange}></textarea>
                {errors.jobDescription && <span className="error-msg">{errors.jobDescription}</span>}
              </div>
            </div>

            <div className="jobpost-form-row">
              <label className="jobpost-label">Responsibilities</label>
              <div className="responsibilities-list" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {formData.responsibilities.map((res, index) => (
                  <div key={index} className="jobpost-input-icon-titile">
                    <input
                      className={`jobpost-input ${errors.responsibilities && index === 0 ? "input-error" : ""}`}
                      type="text"
                      placeholder="Specific day-to-day tasks"
                      value={res}
                      onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                    />
                    {index === formData.responsibilities.length - 1 && (
                      <span className="jobpost-plus-icon" onClick={addResponsibilityField}>+</span>
                    )}
                  </div>
                ))}
                {errors.responsibilities && <span className="error-msg">{errors.responsibilities}</span>}
              </div>
            </div>
          </form>
        </div>

        <div className="jobpost-actions">
          <button type="button" className="jobpost-btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
          <button type="button" className="jobpost-btn-preview" onClick={handleSubmit}>Preview</button>
        </div>
      </main>
      <Footer />
    </div>
  );
};