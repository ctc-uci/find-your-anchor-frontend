import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { ChakraProvider, Button } from '@chakra-ui/react';

import Map from '../../components/Map/Map';
import BoxApproval from '../../components/BoxApproval/BoxApproval';
import RightSideBar from '../../components/RightSideBar/RightSideBar';
import './AdminDashboard.css';

const AdminDashboard = () => {
  // This state determines whether or not to show the admin approval (left) side bar
  const [showReview, setShowReview] = useState(false);
  // This state contains the currently selected zip code (set when a user clicks on a map pin)
  const [selectedZipCode, setSelectedZipCode] = useState(null);
  // This state contains the currently selected country (set when a user clicks on a map pin)
  const [selectedCountry, setSelectedCountry] = useState(null);
  // This state determines when to update the box list. This state is inverted whenever a pin is clicked so that box list is updated
  // See BoxList.jsx for the corresponding useEffect
  const [updateBoxListSwitch, setUpdateBoxListSwitch] = useState(false);
  // This state determines which view to show in the right side bar (set when a user clicks on a box in the right side bar)
  // Not null: Show the full box info view
  // Null: show the box list view
  const [selectedBox, setSelectedBox] = useState(null);
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
            <Map
              setSelectedZipCode={setSelectedZipCode}
              setSelectedCountry={setSelectedCountry}
              setSelectedBox={setSelectedBox}
              updateBoxListSwitch={updateBoxListSwitch}
              setUpdateBoxListSwitch={setUpdateBoxListSwitch}
            />
          </div>

          <Button
            colorScheme="blue"
            className={`review-submission-button ${showReview ? 'show-review' : ''}`}
            onClick={() => setShowReview(true)}
          >
            Review Submission
          </Button>
          <div className={`side-bar ${selectedZipCode && selectedCountry ? 'show-info' : ''}`}>
            <RightSideBar
              selectedZipCode={selectedZipCode}
              selectedCountry={selectedCountry}
              setSelectedZipCode={setSelectedZipCode}
              setSelectedCountry={setSelectedCountry}
              setUpdateBoxListSwitch={setUpdateBoxListSwitch}
              updateBoxListSwitch={updateBoxListSwitch}
              setSelectedBox={setSelectedBox}
              selectedBox={selectedBox}
            />
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
};

export default AdminDashboard;
