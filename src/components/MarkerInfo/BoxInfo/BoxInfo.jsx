import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Text,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';
import Xarrow, { useXarrow } from 'react-xarrows';
import styles from './BoxInfo.module.css';
import { FYABackend } from '../../../common/utils';
import DeleteBoxModal from '../DeleteBoxModal/DeleteBoxModal';
import launchBoxIcon from '../../../assets/BoxIcons/RelocateBoxIcon.svg';
import foundBoxIcon from '../../../assets/BoxIcons/PickupBoxIcon.svg';
import MarkerHistoryElement from '../MarkerHistoryElement/MarkerHistoryElement';
import useMobileWidth from '../../../common/useMobileWidth';

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
  onMarkerInfoToggle,
}) => {
  const isMobile = useMobileWidth();
  const [date, setDate] = useState('');
  const [boxHistory, setBoxHistory] = useState([]);
  const [boxHolderName, setBoxHolderName] = useState('');
  const [boxHolderEmail, setBoxHolderEmail] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [generalLocation, setGeneralLocation] = useState('');
  const [picture, setPicture] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [dropOffMethod, setDropOffMethod] = useState('');
  const [message, setMessage] = useState('');
  const [transactionToggle, setTransactionToggle] = useState(false);
  const [pickup, setPickup] = useState('');
  const updateXarrow = useXarrow();

  const {
    isOpen: isOpenDeleteBoxModal,
    onOpen: onOpenDeleteBoxModal,
    onClose: onCloseDeleteBoxModal,
  } = useDisclosure();

  useEffect(async () => {
    if (selectedBox) {
      const boxData = await FYABackend.get(`/anchorBox/box/${selectedBox}`);
      setDate(boxData.data[0].date);
      setBoxHolderName(boxData.data[0].boxholder_name);
      setBoxHolderEmail(boxData.data[0].boxholder_email);
      setZipCode(boxData.data[0].zip_code);
      setCountry(boxData.data[0].country);
      setGeneralLocation(boxData.data[0].general_location);
      setAdditionalComments(boxData.data[0].additional_comments);
      setDropOffMethod(
        boxData.data[0].launched_organically ? 'Left at Location' : 'Given to Someone',
      );
      setMessage(boxData.data[0].message);
      setPicture(boxData.data[0].picture);
      const history = await FYABackend.get(`/boxHistory/history/${selectedBox}`);
      setBoxHistory(history.data);
      setPickup(boxData.data[0].pickup);
    }
  }, [selectedBox, transactionToggle]);
  return (
    <>
      <div className={styles['box-info']} onLoad={updateXarrow}>
        <div className={styles.header}>
          <ChevronLeftIcon
            className={styles['back-button']}
            boxSize={7}
            onClick={() => setSelectedBox(null)}
          />
          {!isMobile && (
            <img
              className={styles['desktop-icon']}
              src={pickup ? foundBoxIcon : launchBoxIcon}
              alt="box-icon"
            />
          )}
          <div className={styles.title}>
            <div className={styles['icon-number-wrapper']}>
              {isMobile && (
                <img
                  className={styles['mobile-icon']}
                  src={pickup ? foundBoxIcon : launchBoxIcon}
                  alt="box-icon"
                />
              )}
              <p className={styles['box-number']}>Box #{selectedBox}</p>
            </div>
            <div className={styles.date}>{date}</div>
          </div>
        </div>
        <img src={picture} alt="" className={styles.image} />
        <div className={styles['box-data']}>
          <FormControl>
            {/* Box name */}
            {adminIsLoggedIn && boxHolderName && (
              <>
                <FormLabel htmlFor="name" className={styles['form-label']}>
                  Name
                </FormLabel>
                <Input isReadOnly id="name" type="name" value={boxHolderName} />
              </>
            )}
            {/* Box email */}
            {adminIsLoggedIn && boxHolderEmail && (
              <>
                <FormLabel isReadOnly htmlFor="email" className={styles['form-label']}>
                  Email
                </FormLabel>
                <Input isReadOnly id="email" type="email" value={boxHolderEmail} />
              </>
            )}
            {/* Box zip code */}
            {zipCode && (
              <>
                <FormLabel isReadOnly htmlFor="zipCode" className={styles['form-label']}>
                  Zip Code
                </FormLabel>
                <Input isReadOnly id="zipCode" type="zipCode" value={zipCode} />
              </>
            )}
            {/* Box country */}
            {country && (
              <>
                <FormLabel isReadOnly htmlFor="country" className={styles['form-label']}>
                  Country
                </FormLabel>
                <Input isReadOnly id="country" type="country" value={country} />
              </>
            )}
            {/* Box general location */}
            {generalLocation && (
              <>
                <FormLabel isReadOnly htmlFor="generalLocation" className={styles['form-label']}>
                  General Location
                </FormLabel>
                <Input
                  isReadOnly
                  id="generalLocation"
                  type="generalLocation"
                  value={generalLocation}
                />
              </>
            )}
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
                  {boxHistory.map((box, pos) => (
                    <>
                      <MarkerHistoryElement
                        key={1}
                        id={pos}
                        boxLocation={box.general_location}
                        date={box.date}
                        pickup={box.pickup}
                      />
                      {pos < boxHistory.length - 1 && (
                        // This line connects the elements in box history together
                        <Xarrow
                          start={`box-history-element-${pos}`}
                          end={`box-history-element-${pos + 1}`}
                          showHead={false}
                          color="var(--color-light-gray)"
                        />
                      )}
                    </>
                  ))}
                </ul>
              </div>
            </>
          )}
          {adminIsLoggedIn && (
            <div className={styles['button-div']}>
              {isMobile ? (
                <FaTrash
                  className={styles['mobile-delete-box-button']}
                  onClick={onOpenDeleteBoxModal}
                  size="50px"
                />
              ) : (
                <Button
                  className={styles['desktop-delete-box-button']}
                  colorScheme="warning"
                  size="md"
                  onClick={onOpenDeleteBoxModal}
                >
                  Delete Box
                </Button>
              )}
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
                onMarkerInfoToggle={onMarkerInfoToggle}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

BoxInfo.defaultProps = {
  selectedBox: null,
  selectedZipCode: null,
  selectedCountry: null,
};

BoxInfo.propTypes = {
  selectedBox: PropTypes.string,
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
  onMarkerInfoToggle: PropTypes.func.isRequired,
};
export default BoxInfo;
