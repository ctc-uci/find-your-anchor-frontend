import React, { useEffect, useState } from 'react';
import { ChakraProvider, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import Map from '../../components/Map/Map';
import BoxApproval from '../../components/BoxApproval/BoxApproval';
import MarkerInfo from '../../components/MarkerInfo/MarkerInfo';
import { getCurrentUser, auth } from '../../common/auth_utils';
import NavBar from '../../components/NavBar/NavBar';

const Dashboard = () => {
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
  // This state determines whether an admin is logged in or not
  const [adminIsLoggedIn, setAdminIsLoggedIn] = useState(false);

  // This function is called to set isAdmin
  useEffect(async () => {
    setAdminIsLoggedIn((await getCurrentUser(auth)) !== null);
  }, []);

  const navigate = useNavigate();
  return (
    <ChakraProvider>
      <div className={styles.navbar}>
        <NavBar isAdmin={adminIsLoggedIn} />
      </div>
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
          {adminIsLoggedIn ? (
            <Button
              colorScheme="blue"
              className={`${styles['review-submission-button']} ${
                showReview ? styles['show-review'] : ''
              }`}
              onClick={() => setShowReview(true)}
            >
              Review Submission
            </Button>
          ) : (
            <Button
              colorScheme="blue"
              className={styles['review-submission-button']}
              onClick={() => navigate('/login')}
            >
              Admin Login
            </Button>
          )}
          <div
            className={`${styles['side-bar']} ${
              selectedZipCode && selectedCountry ? styles['show-info'] : ''
            }`}
          >
            <MarkerInfo
              selectedZipCode={selectedZipCode}
              selectedCountry={selectedCountry}
              setSelectedZipCode={setSelectedZipCode}
              setSelectedCountry={setSelectedCountry}
              setUpdateBoxListSwitch={setUpdateBoxListSwitch}
              updateBoxListSwitch={updateBoxListSwitch}
              setSelectedBox={setSelectedBox}
              selectedBox={selectedBox}
              adminIsLoggedIn={adminIsLoggedIn}
            />
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
};

export default Dashboard;
