import React, { useState } from 'react';
import UploadCSV from '../../components/UploadCSV/UploadCSV';

function UploadCSVTemp() {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div>
      <h1>Upload CSV Temporary Page</h1>
      <button type="button" href="#" onClick={togglePopup}>
        Upload CSV
      </button>
      {/* {showPopup ? <UploadCSV closePopup={togglePopup} /> : null} */}
      {showPopup ? <UploadCSV /> : null}
    </div>
  );
}

export default UploadCSVTemp;
