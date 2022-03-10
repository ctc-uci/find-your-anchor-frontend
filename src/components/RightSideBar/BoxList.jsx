import React from 'react';
import PropTypes from 'prop-types';
import { ChakraProvider, Box, Text } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import styles from './BoxList.module.css';
// import BoxInfo from './BoxInfo';

function BoxList({ setSelectedBox }) {
  return (
    <ChakraProvider>
      <div className={styles['box-list']}>
        <Text fontSize="lg" className={styles.title}>
          Zip Code: 92657
        </Text>
        <Box className={styles['box-list-item']} onClick={() => setSelectedBox(1)}>
          <div className={styles['box-list-item-text']}>
            <p className={styles['box-number']}>Box #69 </p>
            01/22/2022
          </div>
          <ChevronRightIcon boxSize={10} />
        </Box>
        {/* <BoxInfo /> */}
      </div>
    </ChakraProvider>
  );
}

BoxList.propTypes = {
  setSelectedBox: PropTypes.func.isRequired,
};

export default BoxList;
