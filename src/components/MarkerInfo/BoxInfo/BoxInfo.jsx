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
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';
import styles from './BoxInfo.module.css';
import { FYABackend } from '../../../common/utils';
import DeleteBoxModal from '../DeleteBoxModal/DeleteBoxModal';

const BoxInfo = ({
  selectedBox,
  setSelectedBox,
  adminIsLoggedIn,
  selectedZipCode,
  selectedCountry,
  setSelectedZipCode,
  setSelectedCountry,
  zipCodeData,
  setZipCodeData,
}) => {
  const [boxHistory, setBoxHistory] = useState([]);
  const [boxHolderName, setBoxHolderName] = useState('');
  const [boxHolderEmail, setBoxHolderEmail] = useState('');
  const [generalLocation, setGeneralLocation] = useState('');
  const [picture, setPicture] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [dropOffMethod, setDropOffMethod] = useState('');
  const [message, setMessage] = useState('');
  const [transactionToggle, setTransactionToggle] = useState(false);

  const {
    isOpen: isOpenDeleteBoxModal,
    onOpen: onOpenDeleteBoxModal,
    onClose: onCloseDeleteBoxModal,
  } = useDisclosure();

  useEffect(async () => {
    if (selectedBox) {
      const boxData = await FYABackend.get(`/anchorBox/box/${selectedBox}`);
      setBoxHolderName(boxData.data[0].boxholder_name);
      setBoxHolderEmail(boxData.data[0].boxholder_email);
      setGeneralLocation(boxData.data[0].general_location);
      setAdditionalComments(boxData.data[0].additional_comments);
      setDropOffMethod(
        boxData.data[0].launched_organically ? 'Left at Location' : 'Given to Someone',
      );
      setMessage(boxData.data[0].message);
      setPicture(boxData.data[0].picture);
      const history = await FYABackend.get(`/boxHistory/history/${selectedBox}`);
      setBoxHistory(history.data);
    }
  }, [selectedBox, transactionToggle]);
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
            <p className={styles['box-number']}>Box #{selectedBox}</p>
            {selectedBox.date}
          </p>
        </div>
        <div className={styles['box-data']}>
          <img src={picture} alt="" className={styles['image-corners']} />
          <FormControl>
            {adminIsLoggedIn && (
              <>
                {/* Box name */}
                <FormLabel htmlFor="name" className={styles['form-label']}>
                  Name
                </FormLabel>
                <Input isReadOnly id="name" type="name" value={boxHolderName} />
                {/* Box email */}
                <FormLabel isReadOnly htmlFor="email" className={styles['form-label']}>
                  Email
                </FormLabel>
                <Input isReadOnly id="email" type="email" value={boxHolderEmail} />
              </>
            )}
            {/* Box general location */}
            <FormLabel isReadOnly htmlFor="generalLocation" className={styles['form-label']}>
              General Location
            </FormLabel>
            <Input isReadOnly id="generalLocation" type="generalLocation" value={generalLocation} />
            {/* Box drop off method */}
            <FormLabel htmlFor="dropOffMethod" className={styles['form-label']}>
              Drop Off Method
            </FormLabel>
            <Select disabled placeholder={dropOffMethod} />
            {/* Box message */}
            {message && (
              <>
                <FormLabel htmlFor="message" className={styles['form-label']}>
                  Message
                </FormLabel>
                <Textarea isReadOnly value={message} resize="vertical" />
              </>
            )}
            {adminIsLoggedIn && additionalComments && (
              <>
                <FormLabel htmlFor="additional comments" className={styles['form-label']}>
                  Additional Comments
                </FormLabel>
                <Textarea isReadOnly value={additionalComments} resize="vertical" />
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
              <Button colorScheme="red" size="md" onClick={onOpenDeleteBoxModal}>
                Delete Box
              </Button>
              <DeleteBoxModal
                isOpen={isOpenDeleteBoxModal}
                onClose={onCloseDeleteBoxModal}
                selectedBox={selectedBox}
                setSelectedBox={setSelectedBox}
                selectedZipCode={selectedZipCode}
                selectedCountry={selectedCountry}
                setSelectedZipCode={setSelectedZipCode}
                setSelectedCountry={setSelectedCountry}
                zipCodeData={zipCodeData}
                setZipCodeData={setZipCodeData}
                transactionToggle={transactionToggle}
                setTransactionToggle={setTransactionToggle}
              />
            </div>
          )}
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
    zip_code: PropTypes.string,
    boxholder_name: PropTypes.string,
    boxholder_email: PropTypes.string,
  }).isRequired,
  setSelectedBox: PropTypes.func.isRequired,
  adminIsLoggedIn: PropTypes.bool.isRequired,
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
