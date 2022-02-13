import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import UploadCSV from '../../components/UploadCSV/UploadCSV';

function UploadCSVTemp() {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <ChakraProvider>
      <div>
        <h1>Upload CSV Temporary Page</h1>
        <button type="button" href="#" onClick={togglePopup}>
          Upload CSV
        </button>
        {showPopup && <UploadCSV closePopup={togglePopup} />}
        {/* {showPopup ? <UploadCSV /> : null} */}
      </div>
    </ChakraProvider>
  );
}

export default UploadCSVTemp;
