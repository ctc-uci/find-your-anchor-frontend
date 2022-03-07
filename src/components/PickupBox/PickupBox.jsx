import { React, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
  ChakraProvider,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';

import { BsFillCheckCircleFill, BsXCircleFill } from 'react-icons/bs';
import PropTypes from 'prop-types';
import styles from './PickupBox.module.css';
import RejectBoxPopup from '../AlertPopups/RejectBoxPopup/RejectBoxPopup';
import PickupBoxIcon from '../BoxIcons/PickupBoxIcon.svg';
import { FYABackend } from '../../common/utils';

const PickupBox = ({
  approved,
  boxID,
  boxHolderName,
  boxHolderEmail,
  zipCode,
  picture,
  date,
  status,
  rejectionReason,
  fetchBoxes,
  pickup,
}) => {
  // A state for determining whether or not the rejectBoxPopup is open
  // This state is set true when the reject button is clicked
  const [rejectBoxPopupIsOpen, setRejectBoxPopupIsOpen] = useState(false);

  // A function that updates the approved boolean in the backend and refreshes all boxes that are under review
  // This method is called when the approve box icon is clicked
  const approvePickupBox = async id => {
    FYABackend.put('/boxHistory/approveBox', {
      boxID: id,
    }).then(async () => {
      await fetchBoxes('under review', true);
    });
  };

  return (
    <ChakraProvider>
      <div
        className={`${styles.box}
        ${status === 'evaluated' && approved === true ? styles['box-approved'] : ''}
        ${status === 'evaluated' && approved === false ? styles['box-rejected'] : ''}`}
      >
        <Accordion allowToggle>
          <AccordionItem>
            {/* Pickup box ID and date */}
            <h3>
              <AccordionButton className={styles['accordion-button']}>
                <img src={PickupBoxIcon} alt="" />
                <div className={styles['title-div']}>
                  <p className={styles.title}>
                    <p className={styles['box-number']}>Box #{boxID}</p>
                    {date}
                  </p>
                </div>
                <div className={styles['arrow-button']}>
                  <AccordionIcon />
                </div>
              </AccordionButton>
            </h3>
            {/* Box details */}
            <AccordionPanel className={styles['accordion-panel']} pb={4}>
              <div className={styles['box-details']}>
                {picture !== null && (
                  <img src={picture} alt="" className={styles['pickup-image-corners']} />
                )}
                <FormControl>
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
                  {/* Box zip code */}
                  <FormLabel htmlFor="zipCode" className={styles['form-label']}>
                    Zip Code
                  </FormLabel>
                  <Input isReadOnly id="zipCode" type="zipCode" value={zipCode} />
                  {/* Rejection reason text area (only show if box has been evaluated and bxo was rejected) */}
                  {status === 'evaluated' && !approved && (
                    <>
                      <FormLabel htmlFor="rejectionReason" className={styles['form-label']}>
                        Rejection Reason
                      </FormLabel>
                      <Textarea isReadOnly value={rejectionReason} resize="vertical" />
                    </>
                  )}
                </FormControl>
                {/* Button toolbar (only show if box hasn't been evaluated) */}
                {status !== 'evaluated' && (
                  <div className={styles['icon-row']}>
                    {/* Reject box button */}
                    <div className={styles['close-icon']}>
                      <button
                        type="button"
                        onClick={() => {
                          setRejectBoxPopupIsOpen(!rejectBoxPopupIsOpen);
                        }}
                      >
                        <BsXCircleFill color="red" size="30px" />
                      </button>
                    </div>
                    {/* Approve box button */}
                    <div className={styles['check-icon']}>
                      <button
                        type="button"
                        onClick={() => {
                          approvePickupBox(boxID);
                        }}
                      >
                        <BsFillCheckCircleFill color="green" size="30px" />
                      </button>
                    </div>
                    <RejectBoxPopup
                      isOpen={rejectBoxPopupIsOpen}
                      setIsOpen={setRejectBoxPopupIsOpen}
                      boxID={boxID}
                      boxHolderName={boxHolderName}
                      boxHolderEmail={boxHolderEmail}
                      zipCode={zipCode}
                      pickup={pickup}
                      fetchBoxes={fetchBoxes}
                    />
                  </div>
                )}
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </ChakraProvider>
  );
};

PickupBox.propTypes = {
  approved: PropTypes.bool.isRequired,
  boxID: PropTypes.number.isRequired,
  boxHolderName: PropTypes.string.isRequired,
  boxHolderEmail: PropTypes.string.isRequired,
  zipCode: PropTypes.number.isRequired,
  picture: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  rejectionReason: PropTypes.string.isRequired,
  pickup: PropTypes.bool.isRequired,
  fetchBoxes: PropTypes.func.isRequired,
};

export default PickupBox;
