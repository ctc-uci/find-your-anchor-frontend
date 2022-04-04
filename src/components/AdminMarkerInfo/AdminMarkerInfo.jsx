import React from 'react';
import PropTypes from 'prop-types';
import { ChakraProvider } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import styles from './AdminMarkerInfo.module.css';
import BoxList from './BoxList/BoxList';
import BoxInfo from './BoxInfo/BoxInfo';

const AdminMarkerInfo = ({
  selectedCountry,
  selectedZipCode,
  setSelectedZipCode,
  setSelectedCountry,
  setSelectedBox,
  updateBoxListSwitch,
  selectedBox,
  zipCodeData,
  setZipCodeData,
}) => {
  // This function clears the selected zip code/country states (called when the user exits out of the right side bar)
  const clearSelectedInfo = () => {
    setSelectedZipCode(null);
    setSelectedCountry(null);
  };
  return (
    <ChakraProvider>
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
            selectedZipCode={selectedZipCode}
            selectedCountry={selectedCountry}
            setSelectedZipCode={setSelectedZipCode}
            setSelectedCountry={setSelectedCountry}
            zipCodeData={zipCodeData}
            setZipCodeData={setZipCodeData}
          />
        ) : (
          <BoxList
            selectedCountry={selectedCountry}
            selectedZipCode={selectedZipCode}
            setSelectedBox={setSelectedBox}
            updateBoxListSwitch={updateBoxListSwitch}
          />
        )}
      </div>
    </ChakraProvider>
  );
};

AdminMarkerInfo.defaultProps = {
  selectedZipCode: null,
  selectedCountry: null,
  selectedBox: null,
};

AdminMarkerInfo.propTypes = {
  selectedCountry: PropTypes.string,
  updateBoxListSwitch: PropTypes.bool.isRequired,
  setSelectedZipCode: PropTypes.func.isRequired,
  setSelectedCountry: PropTypes.func.isRequired,
  selectedZipCode: PropTypes.string,
  selectedBox: PropTypes.shape({
    box_id: PropTypes.number,
    additional_comments: PropTypes.string,
    country: PropTypes.string,
    date: PropTypes.string,
    general_location: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    message: PropTypes.string,
    launched_organically: PropTypes.bool,
    picture: PropTypes.string,
    show_on_map: PropTypes.bool,
    zip_code: PropTypes.string,
  }),
  setSelectedBox: PropTypes.func.isRequired,
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
};

export default AdminMarkerInfo;
