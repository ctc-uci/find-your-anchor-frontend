import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChakraProvider, Box, Text } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import styles from './BoxList.module.css';
import { FYABackend } from '../../../common/utils';
import launchBoxIcon from '../../../assets/BoxIcons/RelocateBoxIcon.svg';
import foundBoxIcon from '../../../assets/BoxIcons/PickupBoxIcon.svg';

const BoxList = ({ selectedCountry, selectedZipCode, setSelectedBox, updateBoxListSwitch }) => {
  // This state contains all boxes to be shown in the right side bar
  const [boxList, setBoxList] = useState([]);

  // Load all boxes in the current selected pin
  // This useEffect is triggered whenever the user clicks on a pin
  useEffect(async () => {
    if (selectedCountry && selectedZipCode) {
      const anchorBoxes = await FYABackend.get('/anchorBox', {
        params: {
          zipCode: selectedZipCode,
          country: selectedCountry,
        },
      });
      setBoxList([
        ...anchorBoxes.data,
        ...anchorBoxes.data,
        ...anchorBoxes.data,
        ...anchorBoxes.data,
      ]);
    }
  }, [updateBoxListSwitch]);
  return (
    <ChakraProvider>
      <div className={styles['box-list']}>
        <Text fontSize="lg" className={styles.title}>
          Zip Code: {selectedZipCode}
        </Text>
        {boxList &&
          boxList.map(box => (
            <Box
              key={box.box_id}
              className={styles['box-list-item']}
              onClick={() => setSelectedBox(box.box_id)}
            >
              <div className={styles['box-list-item-wrapper']}>
                <img
                  className={styles['box-icon']}
                  src={box.pickup ? foundBoxIcon : launchBoxIcon}
                  alt="box-icon"
                />
                <div className={styles['box-list-item-text']}>
                  <p className={styles['box-number']}>Box #{box.box_id}</p>
                  {box.date}
                </div>
              </div>
              <ChevronRightIcon boxSize={10} />
            </Box>
          ))}
      </div>
    </ChakraProvider>
  );
};

BoxList.defaultProps = {
  selectedCountry: null,
  selectedZipCode: null,
};

BoxList.propTypes = {
  selectedCountry: PropTypes.string,
  selectedZipCode: PropTypes.string,
  setSelectedBox: PropTypes.func.isRequired,
  updateBoxListSwitch: PropTypes.bool.isRequired,
};

export default BoxList;
