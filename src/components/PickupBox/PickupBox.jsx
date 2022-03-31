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
import { renderEmail } from 'react-html-email';
import PropTypes from 'prop-types';
import styles from './PickupBox.module.css';
import RejectBoxPopup from '../AlertPopups/RejectBoxPopup/RejectBoxPopup';
import PickupBoxIcon from '../BoxIcons/PickupBoxIcon.svg';
import CustomToast from '../../common/CustomToast/CustomToast';
import ApprovedBoxEmail from '../Email/EmailTemplates/ApprovedBoxEmail';
import { FYABackend, sendEmail } from '../../common/utils';

const PickupBox = ({
  approved,
  transactionID,
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
  toast,
  imageStatus,
}) => {
  // A state for determining whether or not the rejectBoxPopup is open
  // This state is set true when the reject button is clicked
  const [rejectBoxPopupIsOpen, setRejectBoxPopupIsOpen] = useState(false);
  // A function that updates the approved boolean in the backend and refreshes all boxes that are under review
  // This method is called when the approve box icon is clicked
  const showToast = CustomToast({
    icon: 'success',
    title: `Box #${boxID} Approved`,
    message: '',
    toastPosition: 'bottom-right',
  });

  const errorToast = CustomToast({
    icon: 'error',
    title: `Failed to Approve Box #${boxID}`,
    message: '',
    toastPosition: 'bottom-right',
  });

  const approvePickupBox = async id => {
    try {
      const boxId = id;
      CustomToast(toast, {
        icon: 'success',
        title: `Box # Approved`,
        message: '',
        toastPosition: 'bottom-right',
      });
      FYABackend.put('/boxHistory/approveBox', {
        boxID: boxId,
      }).then(async () => {
        await fetchBoxes('under review', true);
        await FYABackend.put('/boxHistory/approveBox', {
          transactionID: id,
        });
        const requests = [
          fetchBoxes('under review', true),
          sendEmail(
            boxHolderName,
            boxHolderEmail,
            renderEmail(<ApprovedBoxEmail boxHolderName={boxHolderName} />),
          ),
        ];
        await Promise.all(requests);
        showToast();
      });
    } catch (err) {
      errorToast();
    }
  };

  const updateImageStatus = async newStatus => {
    await FYABackend.put('/boxHistory/update', {
      transactionID,
      boxID,
      imageStatus: newStatus,
    });
    await fetchBoxes(status, true);
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
                {(status !== 'evaluated' || imageStatus !== 'rejected') && picture && (
                  <img
                    src={picture}
                    alt=""
                    className={`${styles['pickup-image-corners']}
                    ${imageStatus === 'approved' ? `${styles['image-approved']}` : ''}
                    ${imageStatus === 'rejected' ? `${styles['image-rejected']}` : ''}`}
                  />
                )}
                {picture && status !== 'evaluated' && (
                  <div className={styles['image-functionality-wrapper']}>
                    {/* Image approved indicator (only show if image is approved) */}
                    <div className={styles['image-functionality']}>
                      {imageStatus === 'approved' && (
                        <>
                          <button type="button" className={styles['approval-button']}>
                            <BsFillCheckCircleFill color="green" />
                          </button>
                          <p className={styles['approval-message']}>Image Approved</p>
                        </>
                      )}
                      {/* Image rejected indicator (only show if image is rejected) */}
                      {imageStatus === 'rejected' && (
                        <>
                          <button type="button" className={styles['rejection-button']}>
                            <BsXCircleFill color="red" />
                          </button>
                          <p className={styles['rejection-message']}>Image Denied</p>
                        </>
                      )}
                    </div>
                    {/* Approve image button */}
                    <button
                      type="button"
                      className={styles['image-approved-button']}
                      onClick={async () => updateImageStatus('approved')}
                    >
                      <BsFillCheckCircleFill color="green" />
                    </button>
                    {/* Reject image button */}
                    <button
                      type="button"
                      className={styles['image-rejected-button']}
                      onClick={async () => updateImageStatus('rejected')}
                    >
                      <BsXCircleFill color="red" />
                    </button>
                  </div>
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
                        onClick={() => setRejectBoxPopupIsOpen(!rejectBoxPopupIsOpen)}
                      >
                        <BsXCircleFill className={styles['rejected-icon']} />
                      </button>
                    </div>
                    {/* Approve box button */}
                    <div className={styles['check-icon']}>
                      <button type="button" onClick={() => approvePickupBox(transactionID)}>
                        <BsFillCheckCircleFill className={styles['approved-icon']} />
                      </button>
                    </div>
                    <RejectBoxPopup
                      isOpen={rejectBoxPopupIsOpen}
                      setIsOpen={setRejectBoxPopupIsOpen}
                      transactionID={transactionID}
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
  transactionID: PropTypes.number.isRequired,
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
  toast: PropTypes.func.isRequired,
  imageStatus: PropTypes.string.isRequired,
};

export default PickupBox;
