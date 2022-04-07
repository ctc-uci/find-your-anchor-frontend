import React from 'react';
import PropTypes from 'prop-types';
import { ChakraProvider } from '@chakra-ui/react';
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
  updateBoxListSwitch,
  selectedBox,
  adminIsLoggedIn,
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
            adminIsLoggedIn={adminIsLoggedIn}
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

MarkerInfo.defaultProps = {
  selectedZipCode: null,
  selectedCountry: null,
  selectedBox: null,
  adminIsLoggedIn: false,
};

MarkerInfo.propTypes = {
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
  adminIsLoggedIn: PropTypes.bool,
};

export default MarkerInfo;
