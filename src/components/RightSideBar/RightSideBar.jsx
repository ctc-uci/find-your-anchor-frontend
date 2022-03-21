import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChakraProvider } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import styles from './RightSideBar.module.css';
import BoxList from './BoxList';
import BoxInfo from './BoxInfo';

const RightSideBar = ({ setShowInfo }) => {
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
          onClick={() => setShowInfo(false)}
        />
        {selectedBox ? (
          <BoxInfo boxID={selectedBox} setSelectedBox={setSelectedBox} />
        ) : (
          <BoxList setSelectedBox={setSelectedBox} />
        )}
      </div>
    </ChakraProvider>
  );
};

RightSideBar.propTypes = {
  setShowInfo: PropTypes.func.isRequired,
};

export default RightSideBar;
