import React from 'react';
import { ChakraProvider, Button } from '@chakra-ui/react';
import Map from '../../components/Map/Map';
import BoxApproval from '../../components/BoxApproval/BoxApproval';
import './AdminDashboard.css';

function AdminDashboard() {
  const [showReview, setShowReview] = React.useState();

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
          <div className={`map ${showReview ? 'show-review' : ''}`}>
            <Map />
          </div>

          <Button
            colorScheme="blue"
            className={`review-submission-button ${showReview ? 'show-review' : ''}`}
            onClick={() => setShowReview(true)}
          >
            Review Submission
          </Button>
        </div>
      </div>
    </ChakraProvider>
  );
}

export default AdminDashboard;
