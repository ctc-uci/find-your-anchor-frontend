import React from 'react';
import { ChakraProvider, Button } from '@chakra-ui/react';

import Map from '../../components/Map/Map';
import BoxApproval from '../../components/BoxApproval/BoxApproval';
import NavBar from '../../components/NavBar/NavBar';
import './AdminDashboard.css';

function AdminDashboard() {
  const setReviewSubmission = () => {
    const sideBarComponent = document.getElementsByClassName('side-bar')[0];
    const mapComponent = document.getElementsByClassName('map')[0];
    const reviewSubmissionComponent = document.getElementsByClassName(
      'review-submission-button',
    )[0];
    sideBarComponent.style.display = 'block';
    mapComponent.style.width = '80vw';
    reviewSubmissionComponent.style.display = 'none';
  };

  const setCloseButton = () => {
    const sideBarComponent = document.getElementsByClassName('side-bar')[0];
    const mapComponent = document.getElementsByClassName('map')[0];
    const reviewSubmissionComponent = document.getElementsByClassName(
      'review-submission-button',
    )[0];
    sideBarComponent.style.display = 'none';
    mapComponent.style.width = '100vw';
    reviewSubmissionComponent.style.display = 'block';
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-nav-bar">
        <NavBar />
      </div>
      <div className="side-bar-and-map-container">
        <div className="side-bar">
          <BoxApproval />
          <Button
            variant="link"
            colorScheme="white"
            className="close-button"
            onClick={() => setCloseButton()}
          >
            Close
          </Button>
        </div>
        <div className="map">
          <Map />
        </div>
        <ChakraProvider>
          <Button
            colorScheme="blue"
            className="review-submission-button"
            onClick={() => setReviewSubmission()}
          >
            Review Submission
          </Button>
        </ChakraProvider>
      </div>
    </div>
  );
}

export default AdminDashboard;
