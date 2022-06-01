import React, { useEffect, useState, useRef } from 'react';
import { Button, Slide, IconButton, useDisclosure } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import Map from '../../components/Map/Map';
import BoxApproval from '../../components/BoxApproval/BoxApproval';
import MarkerInfo from '../../components/MarkerInfo/MarkerInfo';
import { getCurrentUser, auth } from '../../common/auth_utils';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    isOpen: boxApprovalIsOpen,
    onClose: closeBoxApproval,
    onOpen: openBoxApproval,
    onToggle: onBoxApprovalToggle,
  } = useDisclosure();
  const {
    isOpen: markerInfoIsOpen,
    onClose: closeMarkerInfo,
    onOpen: openMarkerInfo,
  } = useDisclosure();

  // This state contains the currently selected zip code (set when a user clicks on a map pin)
  const [selectedZipCode, setSelectedZipCode] = useState(null);
  // This state contains the currently selected country (set when a user clicks on a map pin)
  const [selectedCountry, setSelectedCountry] = useState(null);
  // This state determines which view to show in the right side bar (set when a user clicks on a box in the right side bar)
  // Not null: Show the full box info view
  // Null: show the box list view
  const [selectedBox, setSelectedBox] = useState(null);

  // Not null: show the box transaction view
  const [selectedBoxTransaction, setSelectedBoxTransaction] = useState(null);

  // This state determines whether an admin is logged in or not
  const [adminIsLoggedIn, setAdminIsLoggedIn] = useState(false);

  // This state determines the box list page index
  const [boxListPageIndex, setBoxListPageIndex] = useState(1);

  // This function is called to set isAdmin
  useEffect(async () => {
    setAdminIsLoggedIn((await getCurrentUser(auth)) !== null);
  }, []);

  // This function opens the left sidebar closes the right sidebar when the review submission button is clicked
  const handleReviewSubmissionsClicked = () => {
    // Close right sidebar
    closeMarkerInfo();
    setSelectedZipCode(null);
    setSelectedCountry(null);
    openBoxApproval();
  };
  const btnRef = useRef();
  // A list containing all unique zip codes stored in Anchor_Box
  const [zipCodeData, setZipCodeData] = useState([]);
  return (
    <>
      <div className={styles.navbar}>
        <NavBar isAdmin={adminIsLoggedIn} />
      </div>
      <div className={styles['admin-dashboard-container']}>
        <div className={styles['side-bar-and-map-container']}>
          <Slide
            className={
              adminIsLoggedIn
                ? styles['box-approval-slide-admin']
                : styles['box-approval-slide-general']
            }
            direction="left"
            in={boxApprovalIsOpen}
          >
            <IconButton
              className={styles['close-button']}
              aria-label="Close Control Panel"
              icon={<CloseIcon />}
              onClick={onBoxApprovalToggle}
            />
            <BoxApproval setZipCodeData={setZipCodeData} />
          </Slide>
          <div
            className={`${styles.map} ${
              adminIsLoggedIn ? `${styles['admin-map']}` : `${styles['general-user-map']}`
            }`}
          >
            <Map
              setSelectedZipCode={setSelectedZipCode}
              setSelectedCountry={setSelectedCountry}
              selectedBox={selectedBox}
              setSelectedBox={setSelectedBox}
              setSelectedBoxTransaction={setSelectedBoxTransaction}
              zipCodeData={zipCodeData}
              setZipCodeData={setZipCodeData}
              boxApprovalIsOpen={boxApprovalIsOpen}
              onBoxApprovalToggle={onBoxApprovalToggle}
              closeBoxApproval={closeBoxApproval}
              closeMarkerInfo={closeMarkerInfo}
              openMarkerInfo={openMarkerInfo}
              setBoxListPageIndex={setBoxListPageIndex}
            />
          </div>
          {adminIsLoggedIn ? (
            <Button
              className={`${styles['review-submission-button']} ${styles['admin-button']}`}
              ref={btnRef}
              onClick={handleReviewSubmissionsClicked}
              colorScheme="button"
            >
              Review Submission
            </Button>
          ) : (
            <Button
              className={`${styles['review-submission-button']} ${styles['general-user-button']}`}
              onClick={() => navigate('/login')}
              colorScheme="button"
            >
              Admin Login
            </Button>
          )}
          <Slide
            className={
              adminIsLoggedIn
                ? styles['marker-info-slide-admin']
                : styles['marker-info-slide-general']
            }
            direction="right"
            in={markerInfoIsOpen}
          >
            <MarkerInfo
              selectedZipCode={selectedZipCode}
              selectedCountry={selectedCountry}
              setSelectedZipCode={setSelectedZipCode}
              setSelectedCountry={setSelectedCountry}
              setSelectedBox={setSelectedBox}
              selectedBox={selectedBox}
              setSelectedBoxTransaction={setSelectedBoxTransaction}
              selectedBoxTransaction={selectedBoxTransaction}
              adminIsLoggedIn={adminIsLoggedIn}
              zipCodeData={zipCodeData}
              setZipCodeData={setZipCodeData}
              openMarkerInfo={openMarkerInfo}
              closeMarkerInfo={closeMarkerInfo}
              markerInfoIsOpen={markerInfoIsOpen}
              boxListPageIndex={boxListPageIndex}
              setBoxListPageIndex={setBoxListPageIndex}
            />
          </Slide>
        </div>
        {!adminIsLoggedIn && <Footer />}
      </div>
    </>
  );
};

export default Dashboard;
