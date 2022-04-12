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

const BoxInfo = ({ selectedBox, setSelectedBox, adminIsLoggedIn }) => {
  const [boxHistory, setBoxHistory] = useState([]);
  useEffect(async () => {
    const response = await FYABackend.get(`/boxHistory/history/${selectedBox.box_id}`);
    setBoxHistory(response.data);
  }, []);
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
            {adminIsLoggedIn && (
              <>
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
              </>
            )}
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
            {selectedBox.message && (
              <>
                <FormLabel htmlFor="message" className={styles['form-label']}>
                  Message
                </FormLabel>
                <Textarea isReadOnly value={selectedBox.message} resize="vertical" />
              </>
            )}
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
          {adminIsLoggedIn && (
            <div className={styles['button-div']}>
              <Button colorScheme="red" size="md">
                Delete Box
              </Button>
            </div>
          )}
        </div>
      </div>
    </ChakraProvider>
  );
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
  adminIsLoggedIn: PropTypes.bool.isRequired,
};
export default BoxInfo;
