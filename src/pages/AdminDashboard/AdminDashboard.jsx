import React, { useState } from 'react';
import { ChakraProvider, Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import styles from './AdminDashboard.module.css';
import Map from '../../components/Map/Map';
import BoxApproval from '../../components/BoxApproval/BoxApproval';
import AdminMarkerInfo from '../../components/AdminMarkerInfo/AdminMarkerInfo';

const AdminDashboard = ({ isAdmin }) => {
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
      <div className={styles['admin-dashboard-container']}>
        <div className={styles['side-bar-and-map-container']}>
          <div className={`${styles['side-bar']} ${showReview ? styles['show-review'] : ''}`}>
            <BoxApproval />
            <Button
              variant="link"
              colorScheme="white"
              className={styles['close-button']}
              onClick={() => setShowReview(false)}
            >
              Close
            </Button>
          </div>
          <div
            className={`${styles.map}
            ${showReview && !selectedZipCode ? styles['one-bar-open'] : ''}
            ${selectedZipCode && !showReview ? styles['one-bar-open'] : ''}
            ${selectedZipCode && showReview ? styles['two-bars-open'] : ''}`}
          >
            <Map
              setSelectedZipCode={setSelectedZipCode}
              setSelectedCountry={setSelectedCountry}
              setSelectedBox={setSelectedBox}
              updateBoxListSwitch={updateBoxListSwitch}
              setUpdateBoxListSwitch={setUpdateBoxListSwitch}
            />
          </div>
          {isAdmin && (
            <Button
              colorScheme="blue"
              className={`${styles['review-submission-button']} ${
                showReview ? styles['show-review'] : ''
              }`}
              onClick={() => setShowReview(true)}
            >
              Review Submission
            </Button>
          )}
          {!isAdmin && (
            <Button colorScheme="blue" className={styles['review-submission-button']}>
              Admin Login
            </Button>
          )}
          <div
            className={`${styles['side-bar']} ${
              selectedZipCode && selectedCountry ? styles['show-info'] : ''
            }`}
          >
            <AdminMarkerInfo
              selectedZipCode={selectedZipCode}
              selectedCountry={selectedCountry}
              setSelectedZipCode={setSelectedZipCode}
              setSelectedCountry={setSelectedCountry}
              setUpdateBoxListSwitch={setUpdateBoxListSwitch}
              updateBoxListSwitch={updateBoxListSwitch}
              setSelectedBox={setSelectedBox}
              selectedBox={selectedBox}
              isAdmin={isAdmin}
            />
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
};

AdminDashboard.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};

export default AdminDashboard;
