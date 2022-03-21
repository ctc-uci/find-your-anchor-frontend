import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChakraProvider, Box, Text } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import styles from './BoxList.module.css';
import { FYABackend } from '../../common/utils';

const BoxList = ({ selectedCountry, selectedZipCode, setSelectedBox }) => {
  const [boxList, setBoxList] = useState([]);

  useEffect(async () => {
    if (selectedCountry) {
      const anchorBoxes = await FYABackend.get('/anchorBox', {
        params: {
          zipCode: selectedZipCode,
          country: selectedCountry,
        },
      });
      setBoxList(anchorBoxes.data);
    }
  }, [selectedCountry]);
  return (
    <ChakraProvider>
      <div className={styles['box-list']}>
        <Text fontSize="lg" className={styles.title}>
          Zip Code: 92657
        </Text>
        {boxList &&
          boxList.map(() => (
            <Box key={1} className={styles['box-list-item']} onClick={() => setSelectedBox(1)}>
              <div className={styles['box-list-item-text']}>
                <p className={styles['box-number']}>Box #69 </p>
                01/22/2022
              </div>
              <ChevronRightIcon boxSize={10} />
            </Box>
          ))}
        {/* <BoxInfo /> */}
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
};

export default BoxList;
