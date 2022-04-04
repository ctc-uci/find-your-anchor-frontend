import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Text,
  Button,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';
import styles from './BoxInfo.module.css';
import { FYABackend } from '../../../common/utils';

const BoxInfo = ({
  selectedBox,
  setSelectedBox,
  selectedZipCode,
  selectedCountry,
  setSelectedZipCode,
  setSelectedCountry,
  zipCodeData,
  setZipCodeData,
}) => {
  const [boxHistory, setBoxHistory] = useState([]);
  useEffect(async () => {
    const response = await FYABackend.get(`/boxHistory/history/${selectedBox.box_id}`);
    setBoxHistory(response.data);
  }, []);

  // Deletes the currently selected box in both Anchor_Box and Box_History
  const deleteBox = async () => {
    try {
      const deleteRequests = [
        // Delete the box in Box_History
        await FYABackend.delete(`/boxHistory/${selectedBox.box_id}`),
        // Delete the box in Anchor_Box
        await FYABackend.delete(`/anchorBox/${selectedBox.box_id}`),
      ];
      await Promise.allSettled(deleteRequests);
      // Refetch box list
      const anchorBoxesInZipCode = await FYABackend.get('/anchorBox', {
        params: {
          zipCode: selectedZipCode,
          country: selectedCountry,
        },
      });
      // If the box list is now empty, remove marker from map
      if (anchorBoxesInZipCode.data.length === 0) {
        setZipCodeData(
          zipCodeData.filter(zipCodeInfo => zipCodeInfo.zip_code !== selectedBox.zip_code),
        );
        setSelectedZipCode(null);
        setSelectedCountry(null);
        // If box list is not empty, decrement the marker's label
      } else {
        const index = zipCodeData.findIndex(
          zipCodeInfo => zipCodeInfo.zip_code === selectedBox.zip_code,
        );
        const newZipCodeInfo = {
          ...zipCodeData[index],
          box_count: zipCodeData[index].box_count - 1,
        };
        setZipCodeData([
          ...zipCodeData.filter(zipCodeInfo => zipCodeInfo.zip_code !== selectedBox.zip_code),
          newZipCodeInfo,
        ]);
      }
      // Set the delete box to null
      setSelectedBox(null);
      // TODO: Add toast to show box deleted
    } catch (err) {
      // TODO: Add toast if something goes wrong
      // eslint-disable-next-line no-console
      console.log(err.message);
    }
  };
  return (
    <ChakraProvider>
      <div className={styles['box-info']}>
        <div className={styles.header}>
          <ChevronLeftIcon
            className={styles['back-button']}
            boxSize={7}
            onClick={() => setSelectedBox(null)}
          />
          <p className={styles.title}>
            <p className={styles['box-number']}>Box #{selectedBox.box_id}</p>
            {selectedBox.date}
          </p>
        </div>
        <div className={styles['box-data']}>
          <img src={selectedBox.picture} alt="" className={styles['image-corners']} />
          <FormControl>
            {/* Box name */}
            <FormLabel htmlFor="name" className={styles['form-label']}>
              Name
            </FormLabel>
            <Input isReadOnly id="name" type="name" value={selectedBox.boxholder_name} />
            {/* Box email */}
            <FormLabel isReadOnly htmlFor="email" className={styles['form-label']}>
              Email
            </FormLabel>
            <Input isReadOnly id="email" type="email" value={selectedBox.boxholder_email} />
            {/* Box general location */}
            <FormLabel isReadOnly htmlFor="generalLocation" className={styles['form-label']}>
              General Location
            </FormLabel>
            <Input
              isReadOnly
              id="generalLocation"
              type="generalLocation"
              value={selectedBox.general_location}
            />
            {/* Box drop off method */}
            <FormLabel htmlFor="dropOffMethod" className={styles['form-label']}>
              Drop Off Method
            </FormLabel>
            <Select
              disabled
              placeholder={
                selectedBox.launched_organically ? 'Left at Location' : 'Given to Someone'
              }
            />
            {/* Box message */}
            <FormLabel htmlFor="message" className={styles['form-label']}>
              Message
            </FormLabel>
            <Textarea isReadOnly value={selectedBox.additional_comments} resize="vertical" />
          </FormControl>
          {boxHistory.length > 0 && (
            <>
              <div className={styles['history-div']}>
                <Text fontSize="md" fontWeight="500">
                  History
                </Text>
              </div>
              <div className={styles['history-graph']}>
                <ul className={styles['history-graph-items']}>
                  {boxHistory.map(box => (
                    <li key={box.transaction_id} className={styles['history-graph-item']}>
                      {box.general_location} {box.date}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
          <div className={styles['button-div']}>
            <Button colorScheme="red" size="md" onClick={deleteBox}>
              Delete Box
            </Button>
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
};

BoxInfo.defaultProps = {
  selectedZipCode: null,
  selectedCountry: null,
};

BoxInfo.propTypes = {
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
    boxholder_name: PropTypes.string,
    boxholder_email: PropTypes.string,
  }).isRequired,
  setSelectedBox: PropTypes.func.isRequired,
  selectedZipCode: PropTypes.string,
  selectedCountry: PropTypes.string,
  setSelectedZipCode: PropTypes.func.isRequired,
  setSelectedCountry: PropTypes.func.isRequired,
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
export default BoxInfo;
