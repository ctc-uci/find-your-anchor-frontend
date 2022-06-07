import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChakraProvider, Box, Text } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import styles from './BoxList.module.css';
import { FYABackend } from '../../../common/utils';
import PaginationController from '../../../common/CommonPaginationController/PaginationController';
import launchBoxIcon from '../../../assets/BoxIcons/RelocateBoxIcon.svg';
import foundBoxIcon from '../../../assets/BoxIcons/PickupBoxIcon.svg';

const BoxList = ({
  selectedCountry,
  selectedZipCode,
  setSelectedBox,
  boxListPageIndex,
  setBoxListPageIndex,
}) => {
  // This state contains all boxes to be shown in the right side bar
  const [boxList, setBoxList] = useState([]);
  // Total number of pages for pagination
  const [numPages, setNumPages] = useState(1);

  // Page size to be used for pagination
  const PAGE_SIZE = 8;

  const populateBoxList = async () => {
    const anchorBoxes = await FYABackend.get('/anchorBox', {
      params: {
        zipCode: selectedZipCode,
        country: selectedCountry,
        pageIndex: boxListPageIndex,
        pageSize: PAGE_SIZE,
      },
    });
    setBoxList(anchorBoxes.data);
  };

  // Load all boxes in the current selected pin
  // This useEffect is triggered whenever the user clicks on a pin
  useEffect(async () => {
    if (selectedCountry && selectedZipCode) {
      populateBoxList();

      const totalNumberOfPages = await FYABackend.get('/anchorBox/boxCount', {
        params: {
          pageSize: PAGE_SIZE,
          zipCode: selectedZipCode,
          country: selectedCountry,
        },
      });
      setNumPages(totalNumberOfPages.data[0].totalNumberOfPages);
    }
  }, [selectedZipCode, selectedCountry]);

  // Make another request to get the next page of boxes from the backend whenever pagination controls are used
  useEffect(async () => {
    if (selectedCountry && selectedZipCode) {
      populateBoxList();
    }
  }, [boxListPageIndex]);

  return (
    <ChakraProvider>
      <Text fontSize="lg" className={styles.title}>
        Zip Code: {selectedZipCode}
      </Text>
      <div className={styles['box-list']}>
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
      <PaginationController
        paginatedIndex={boxListPageIndex}
        setPaginatedIndex={setBoxListPageIndex}
        totalNumberOfPages={numPages}
      />
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
  boxListPageIndex: PropTypes.number.isRequired,
  setBoxListPageIndex: PropTypes.func.isRequired,
};

export default BoxList;
