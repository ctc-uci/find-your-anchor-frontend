import React, { useState } from 'react';
import { ChakraProvider, Button } from '@chakra-ui/react';

import Map from '../../components/Map/Map';
import BoxApproval from '../../components/BoxApproval/BoxApproval';
import RightSideBar from '../../components/RightSideBar/RightSideBar';
import './AdminDashboard.css';

function AdminDashboard() {
  const [showReview, setShowReview] = useState();
  const [showInfo, setShowInfo] = useState(false);

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
            ${showReview && !showInfo ? 'one-bar-open' : ''}
            ${showInfo && !showReview ? 'one-bar-open' : ''}
            ${showInfo && showReview ? 'two-bars-open' : ''}`}
          >
            <Map setShowInfo={setShowInfo} />
          </div>

          <Button
            colorScheme="blue"
            className={`review-submission-button ${showReview ? 'show-review' : ''}`}
            onClick={() => setShowReview(true)}
          >
            Review Submission
          </Button>
          <div className={`side-bar ${showInfo ? 'show-info' : ''}`}>
            <RightSideBar setShowInfo={setShowInfo} />
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
}

export default AdminDashboard;
