import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChakraProvider, Box, Text } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import styles from './BoxList.module.css';
import { FYABackend } from '../../common/utils';

const BoxList = ({ selectedCountry, selectedZipCode, setSelectedBox, selectedLocation }) => {
  const [boxList, setBoxList] = useState([]);

  useEffect(async () => {
    if (selectedCountry && selectedZipCode) {
      const anchorBoxes = await FYABackend.get('/anchorBox', {
        params: {
          zipCode: selectedZipCode,
          country: selectedCountry,
        },
      });
      setBoxList(anchorBoxes.data);
    }
  }, [selectedLocation]);
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
              onClick={() => setSelectedBox(box)}
            >
              <div className={styles['box-list-item-text']}>
                <p className={styles['box-number']}>Box #{box.box_id}</p>
                {box.date}
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
  selectedLocation: PropTypes.bool.isRequired,
};

export default BoxList;
