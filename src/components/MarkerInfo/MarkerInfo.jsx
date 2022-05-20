import React from 'react';
import PropTypes from 'prop-types';
import { CloseIcon } from '@chakra-ui/icons';
import styles from './MarkerInfo.module.css';
import BoxList from './BoxList/BoxList';
import BoxInfo from './BoxInfo/BoxInfo';

const MarkerInfo = ({
  selectedCountry,
  selectedZipCode,
  setSelectedZipCode,
  setSelectedCountry,
  setSelectedBox,
  selectedBox,
  adminIsLoggedIn,
  zipCodeData,
  setZipCodeData,
  onMarkerInfoToggle,
  markerInfoIsOpen,
  boxListPageIndex,
  setBoxListPageIndex,
}) => {
  // This function clears the selected zip code/country states (called when the user exits out of the right side bar)
  const clearSelectedInfo = () => {
    onMarkerInfoToggle();
    setSelectedBox(null);
    setSelectedZipCode(null);
    setSelectedCountry(null);
  };
  return (
    <>
      <div
        className={`${
          !selectedBox ? styles['right-side-bar-box-list'] : styles['right-side-bar-box-info']
        }`}
      >
        <CloseIcon boxSize={7} className={styles['close-button']} onClick={clearSelectedInfo} />
        {selectedBox ? (
          <BoxInfo
            selectedBox={selectedBox}
            setSelectedBox={setSelectedBox}
            adminIsLoggedIn={adminIsLoggedIn}
            selectedZipCode={selectedZipCode}
            selectedCountry={selectedCountry}
            setSelectedZipCode={setSelectedZipCode}
            setSelectedCountry={setSelectedCountry}
            zipCodeData={zipCodeData}
            setZipCodeData={setZipCodeData}
            onMarkerInfoToggle={onMarkerInfoToggle}
          />
        ) : (
          <BoxList
            selectedCountry={selectedCountry}
            selectedZipCode={selectedZipCode}
            setSelectedBox={setSelectedBox}
            boxListPageIndex={boxListPageIndex}
            setBoxListPageIndex={setBoxListPageIndex}
            markerInfoIsOpen={markerInfoIsOpen}
          />
        )}
      </div>
    </>
  );
};

MarkerInfo.defaultProps = {
  selectedZipCode: null,
  selectedCountry: null,
  selectedBox: null,
  adminIsLoggedIn: false,
};

MarkerInfo.propTypes = {
  selectedCountry: PropTypes.string,
  setSelectedZipCode: PropTypes.func.isRequired,
  setSelectedCountry: PropTypes.func.isRequired,
  selectedZipCode: PropTypes.string,
  selectedBox: PropTypes.string,
  setSelectedBox: PropTypes.func.isRequired,
  adminIsLoggedIn: PropTypes.bool,
  zipCodeData: PropTypes.arrayOf(
    PropTypes.shape({
      zip_code: PropTypes.string,
      country: PropTypes.string,
      longitude: PropTypes.number,
      latitude: PropTypes.number,
      box_count: PropTypes.number,
    }),
  ).isRequired,
  setZipCodeData: PropTypes.func.isRequired,
  onMarkerInfoToggle: PropTypes.bool.isRequired,
  markerInfoIsOpen: PropTypes.bool.isRequired,
  boxListPageIndex: PropTypes.number.isRequired,
  setBoxListPageIndex: PropTypes.func.isRequired,
};

export default MarkerInfo;
