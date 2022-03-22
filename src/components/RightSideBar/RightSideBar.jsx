import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChakraProvider } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import styles from './RightSideBar.module.css';
import BoxList from './BoxList';
import BoxInfo from './BoxInfo';
import { getLatLon } from '../../common/utils';

const RightSideBar = ({
  selectedCountry,
  selectedZipCode,
  setSelectedZipCode,
  setSelectedBox,
  selectedBox,
}) => {
  useEffect(async () => {
    await getLatLon(92617, 'USA');
  }, []);
  return (
    <ChakraProvider>
      <div
        className={`${
          !selectedBox ? styles['right-side-bar-box-list'] : styles['right-side-bar-box-info']
        }`}
      >
        <CloseIcon
          boxSize={7}
          className={styles['close-button']}
          onClick={() => setSelectedZipCode(null)}
        />
        {selectedBox ? (
          <BoxInfo selectedBox={selectedBox} setSelectedBox={setSelectedBox} />
        ) : (
          <BoxList
            selectedCountry={selectedCountry}
            selectedZipCode={selectedZipCode}
            setSelectedBox={setSelectedBox}
          />
        )}
      </div>
    </ChakraProvider>
  );
};

RightSideBar.defaultProps = {
  selectedZipCode: null,
  selectedCountry: null,
  selectedBox: null,
};

RightSideBar.propTypes = {
  selectedCountry: PropTypes.string,
  setSelectedZipCode: PropTypes.func.isRequired,
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
};

export default RightSideBar;
