import React from 'react';
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

const BoxInfo = ({ boxID, setSelectedBox }) => {
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
            <p className={styles['box-number']}>Box #{boxID}</p>
            01/20/22
          </p>
        </div>
        <div className={styles['box-data']}>
          <img
            src="https://fya-dev.s3.us-west-1.amazonaws.com/266c5ba863b653657de378d9fc6bf262"
            alt=""
            className={styles['image-corners']}
          />
          <FormControl>
            {/* Box name */}
            <FormLabel htmlFor="name" className={styles['form-label']}>
              Name
            </FormLabel>
            <Input isReadOnly id="name" type="name" value="Jane Doe" />
            {/* Box email */}
            <FormLabel isReadOnly htmlFor="email" className={styles['form-label']}>
              Email
            </FormLabel>
            <Input isReadOnly id="email" type="email" value="jdoe12@gmail.com" />
            {/* Box general location */}
            <FormLabel isReadOnly htmlFor="generalLocation" className={styles['form-label']}>
              General Location
            </FormLabel>
            <Input
              isReadOnly
              id="generalLocation"
              type="generalLocation"
              value="Santa Monica Pier"
            />
            {/* Box drop off method */}
            <FormLabel htmlFor="dropOffMethod" className={styles['form-label']}>
              Drop Off Method
            </FormLabel>
            <Select disabled placeholder="Given to Someone" />
            {/* Box message */}
            <FormLabel htmlFor="message" className={styles['form-label']}>
              Message
            </FormLabel>
            <Textarea isReadOnly value="hello" resize="vertical" />
          </FormControl>
          <div className={styles['history-div']}>
            <Text fontSize="md">History</Text>
          </div>
          <div className={styles['history-graph']}>
            <ul>
              <li>1</li>
              <li>2</li>
              <li>3</li>
            </ul>
          </div>
          <div className={styles['button-div']}>
            <Button colorScheme="red" size="md" className={styles['delete-button']}>
              Delete Box
            </Button>
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
};

BoxInfo.propTypes = {
  boxID: PropTypes.number.isRequired,
  setSelectedBox: PropTypes.func.isRequired,
};
export default BoxInfo;
