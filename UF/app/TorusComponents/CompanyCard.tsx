'use client'
import React from 'react';
// Using react-icons for the small icons in the card
import { FaUsers, FaMapMarkerAlt, FaEye } from 'react-icons/fa';
import "../utils/styles.css";
const TorusCompanyCard = ({ company, onViewDetails }:any) => {
  // Destructure the company object prop for cleaner code
  const {
    id,
    logoUrl,
    name,
    plan,
    industry,
    employees,
    location,
    revenue,
    tags
  } = company;

  return (
    <div className="company-card">
      <div className="card-header">
        <div className="header-left">
          <img src={logoUrl} alt={`${name} logo`} className="company-logo" />
          <div className="company-details">
            <span className="company-name">{name}</span>
            <span className="company-industry">{industry}</span>
          </div>
        </div>
        <span className="company-plan">{plan}</span>
      </div>

      <div className="card-body">
        <div className="info-item">
          <FaUsers className="info-icon" />
          <span>{employees} employees</span>
        </div>
        <div className="info-item">
          <FaMapMarkerAlt className="info-icon" />
          <span>{location}</span>
        </div>

        <div className="revenue-section">
          <span className="revenue-label">Revenue</span>
          <span className="revenue-value">${revenue}</span>
        </div>

        {/* Map over the tags array to display them */}
        <div className="tags-container">
          {Array.isArray(tags)
            ? tags.map((tag: any, index: number) => (
                <span key={index} className='tag'>
                  {tag}
                </span>
              ))
            : null}
        </div>
      </div>

      <div className="card-footer">
        <button className="details-button" onClick={() => onViewDetails(id)}>
          <FaEye /> View Details
        </button>
      </div>
    </div>
  );
};

export default TorusCompanyCard;