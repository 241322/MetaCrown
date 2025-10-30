import React from 'react';
import '../Styles/LoadingIndicator.css';

const LoadingIndicator = ({ 
  message = "Loading...", 
  type = "default", 
  showProgress = false,
  progress = 0 
}) => {
  return (
    <div className={`loading-indicator ${type}`}>
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-core"></div>
      </div>
      
      <div className="loading-content">
        <span className="loading-message">{message}</span>
        
        {showProgress && (
          <div className="loading-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="progress-text">{progress}%</span>
          </div>
        )}
        
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;