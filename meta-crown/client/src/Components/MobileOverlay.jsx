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
              <li>Rotate your device to landscape mode (if on tablet)</li>
              <li>Use a larger screen for optimal deck building experience</li>
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