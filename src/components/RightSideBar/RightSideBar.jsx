import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChakraProvider } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import styles from './RightSideBar.module.css';
import BoxList from './BoxList';
import BoxInfo from './BoxInfo';

const RightSideBar = ({ selectedCountry, selectedZipCode, setSelectedZipCode }) => {
  const [selectedBox, setSelectedBox] = useState(null);
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
          <BoxInfo boxID={selectedBox} setSelectedBox={setSelectedBox} />
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
};

RightSideBar.propTypes = {
  selectedCountry: PropTypes.string,
  setSelectedZipCode: PropTypes.func.isRequired,
  selectedZipCode: PropTypes.string,
};

export default RightSideBar;
