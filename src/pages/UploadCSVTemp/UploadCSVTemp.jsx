import React, { useState } from 'react';
import UploadCSV from '../../components/UploadCSV/UploadCSV';
import './UploadCSVTemp.css';

function UploadCSVTemp() {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div>
      <div className={showPopup ? 'csv-container upload-csv-dim' : 'csv-container'}>
        <h1>Upload CSV Temporary Page</h1>
        <button type="button" onClick={togglePopup}>
          Upload CSV
        </button>
      </div>
      {showPopup && <UploadCSV closePopup={togglePopup} className="csv-modal" />}
    </div>
  );
}

export default UploadCSVTemp;
