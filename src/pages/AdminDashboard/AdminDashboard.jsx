import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { ChakraProvider, Button } from '@chakra-ui/react';

import Map from '../../components/Map/Map';
import BoxApproval from '../../components/BoxApproval/BoxApproval';
import RightSideBar from '../../components/RightSideBar/RightSideBar';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [showReview, setShowReview] = useState(false);
  const [selectedZipCode, setSelectedZipCode] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  return (
    <ChakraProvider>
      <div className="admin-dashboard-container">
        <div className="side-bar-and-map-container">
          <div className={`side-bar ${showReview ? 'show-review' : ''}`}>
            <BoxApproval />
            <Button
              variant="link"
              colorScheme="white"
              className="close-button"
              onClick={() => setShowReview(false)}
            >
              Close
            </Button>
          </div>
          <div
            className={`map
            ${showReview && !selectedZipCode ? 'one-bar-open' : ''}
            ${selectedZipCode && !showReview ? 'one-bar-open' : ''}
            ${selectedZipCode && showReview ? 'two-bars-open' : ''}`}
          >
            <Map setSelectedZipCode={setSelectedZipCode} setSelectedCountry={setSelectedCountry} />
          </div>

          <Button
            colorScheme="blue"
            className={`review-submission-button ${showReview ? 'show-review' : ''}`}
            onClick={() => setShowReview(true)}
          >
            Review Submission
          </Button>
          <div className={`side-bar ${selectedZipCode ? 'show-info' : ''}`}>
            <RightSideBar
              selectedZipCode={selectedZipCode}
              selectedCountry={selectedCountry}
              setSelectedZipCode={setSelectedZipCode}
            />
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
};

export default AdminDashboard;
