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
import PickupBoxIcon from '../../assets/BoxIcons/PickupBoxIcon.svg';
import ApprovedPickupIcon from '../../assets/BoxIcons/ApprovedPickupIcon.svg';
import RejectedPickupIcon from '../../assets/BoxIcons/RejectedPickupIcon.svg';
import PendingPickupIcon from '../../assets/BoxIcons/PendingPickupIcon.svg';
import ApprovedBoxEmail from '../Email/EmailTemplates/ApprovedBoxEmail';
import { FYABackend, sendEmail } from '../../common/utils';
import { auth, getCurrentUser } from '../../common/auth_utils';

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
  imageStatus,
  admin,
}) => {
  // A state for determining whether or not the rejectBoxPopup is open
  // This state is set true when the reject button is clicked
  const [rejectBoxPopupIsOpen, setRejectBoxPopupIsOpen] = useState(false);

  // A function that updates the approved boolean in the backend and refreshes all boxes that are under review
  // This method is called when the approve box icon is clicked
  const approvePickupBox = async id => {
    const user = await getCurrentUser(auth);
    const userInDB = await FYABackend.get(`/users/userId/${user.uid}`);
    await FYABackend.put('/boxHistory/update', {
      transactionID: id,
      boxID,
      status: 'evaluated',
      approved: true,
      admin: `${userInDB.data.user.first_name} ${userInDB.data.user.last_name}`,
    });
    await FYABackend.put('/anchorBox/update', {
      boxID,
      showOnMap: false,
    });
    const requests = [
      fetchBoxes('under review', true),
      sendEmail(boxHolderName, boxHolderEmail, <ApprovedBoxEmail boxHolderName={boxHolderName} />),
    ];
    await Promise.all(requests);
  };

  const updateImageStatus = async newStatus => {
    await FYABackend.put('/boxHistory/update', {
      transactionID,
      boxID,
      imageStatus: newStatus,
    });
    await fetchBoxes(status, true);
  };

  // A function that changes the color of the relocation box icon depending on whether it's approved, rejected, pending, or not yet evaluated
  const getColoredIcon = () => {
    if (status === 'evaluated' && approved) {
      return ApprovedPickupIcon;
    }
    if (status === 'evaluated' && approved === false) {
      return RejectedPickupIcon;
    }
    if (status === 'pending changes') {
      return PendingPickupIcon;
    }
    return PickupBoxIcon;
  };

  // A function that creates the string that identifies which admin evaluated the box
  const getStatusMessage = () => {
    if (status === 'evaluated' && approved) {
      return `Approved by ${admin}`;
    }
    if (status === 'evaluated' && approved === false) {
      return `Rejected by ${admin}`;
    }
    if (status === 'pending changes') {
      return `Pending Review by ${admin}`;
    }
    return '';
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
                <img src={getColoredIcon()} alt="" />
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
              <h4>{getStatusMessage()}</h4>
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
                  <Input readOnly id="name" type="name" value={boxHolderName} />
                  {/* Box email */}
                  <FormLabel readOnly htmlFor="email" className={styles['form-label']}>
                    Email
                  </FormLabel>
                  <Input readOnly id="email" type="email" value={boxHolderEmail} />
                  {/* Box zip code */}
                  <FormLabel htmlFor="zipCode" className={styles['form-label']}>
                    Zip Code
                  </FormLabel>
                  <Input readOnly id="zipCode" type="zipCode" value={zipCode} />
                  {/* Rejection reason text area (only show if box has been evaluated and bxo was rejected) */}
                  {status === 'evaluated' && !approved && (
                    <>
                      <FormLabel htmlFor="rejectionReason" className={styles['form-label']}>
                        Rejection Reason
                      </FormLabel>
                      <Textarea readOnly value={rejectionReason} resize="vertical" />
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
  zipCode: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  rejectionReason: PropTypes.string.isRequired,
  pickup: PropTypes.bool.isRequired,
  fetchBoxes: PropTypes.func.isRequired,
  imageStatus: PropTypes.string.isRequired,
  admin: PropTypes.string.isRequired,
};

export default PickupBox;
