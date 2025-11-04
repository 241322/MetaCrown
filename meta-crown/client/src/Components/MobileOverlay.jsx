import React from 'react';
import '../Styles/MobileOverlay.css';

const MobileOverlay = () => {
  return (
    <div className="mobile-overlay">
      <div className="mobile-message-container">
        <div className="mobile-logo">
          <h1>MetaCrown</h1>
        </div>
        <div className="mobile-message">
          <h2>Desktop Experience Required</h2>
          <p>
            MetaCrown is optimized for desktop and laptop computers to provide 
            the best deck building and strategic gameplay experience.
          </p>
          <div className="mobile-instructions">
            <h3>To access MetaCrown:</h3>
            <ul>
              <li>Visit us on a desktop computer or laptop</li>
              <li>Use a screen resolution of at least 1292px width</li>
              <li>Ensure you have a mouse or trackpad for optimal interaction</li>
            </ul>
          </div>
          <div className="mobile-contact">
            <p>Questions? Contact us at <a href="mailto:support@metacrown.co.za">support@metacrown.co.za</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileOverlay;