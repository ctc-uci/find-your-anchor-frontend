import { React, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import countryList from 'react-select-country-list';
import { BsFillCheckCircleFill, BsXCircleFill } from 'react-icons/bs';
import PropTypes from 'prop-types';
import styles from './PickupBox.module.css';
import RejectBoxPopup from '../AlertPopups/RejectBoxPopup/RejectBoxPopup';
import PickupBoxIcon from '../../assets/BoxIcons/PickupBoxIcon.svg';
import ApprovedPickupIcon from '../../assets/BoxIcons/ApprovedPickupIcon.svg';
import RejectedPickupIcon from '../../assets/BoxIcons/RejectedPickupIcon.svg';
import PendingPickupIcon from '../../assets/BoxIcons/PendingPickupIcon.svg';
import AdminApprovalProcessEmail from '../Email/EmailTemplates/AdminApprovalProcessEmail';
import { FYABackend, getLatLong, sendEmail } from '../../common/utils';
import { auth, getCurrentUser } from '../../common/auth_utils';
import { useCustomToast } from '../ToastProvider/ToastProvider';

const PickupBox = ({
  approved,
  transactionID,
  boxID,
  boxHolderName,
  boxHolderEmail,
  zipCode,
  country,
  picture,
  date,
  status,
  rejectionReason,
  fetchBoxes,
  pickup,
  imageStatus,
  admin,
  verificationPicture,
  reloadMap,
}) => {
  // A state for determining whether or not the rejectBoxPopup is open
  // This state is set true when the reject button is clicked
  const [rejectBoxPopupIsOpen, setRejectBoxPopupIsOpen] = useState(false);
  const { showToast } = useCustomToast();
  // A function that updates the approved boolean in the backend and refreshes all boxes that are under review
  // This method is called when the approve box icon is clicked
  const approvePickupBox = async id => {
    try {
      const user = await getCurrentUser(auth);
      const userInDB = await FYABackend.get(`/users/userId/${user.uid}`);

      // Retrieve date of most recent transaction.
      const transaction = await FYABackend.get(`/boxHistory/mostRecentTransaction/${boxID}`);

      await FYABackend.put('/boxHistory/update', {
        transactionID: id,
        boxID,
        status: 'evaluated',
        approved: true,
        pickup,
        admin: `${userInDB.data.user.first_name} ${userInDB.data.user.last_name}`,
      });
      if (
        transaction.data.length === 0 ||
        Date.parse(transaction.data[0].mostrecentdate) <= Date.parse(date)
      ) {
        // TODO: REPLACE US WITH COUNTRY INPUT
        let coordinates = await getLatLong(zipCode, country);
        if (coordinates.length !== 2) {
          coordinates = [null, null];
        }

        await FYABackend.put('/boxHistory/approveBox', {
          transactionID,
          latitude: coordinates[0],
          longitude: coordinates[1],
          isMostRecentDate: true,
        });
      } else {
        await FYABackend.put('/boxHistory/approveBox', { transactionID, isMostRecentDate: false });
      }
      const requests = [
        fetchBoxes('under review', true),
        reloadMap(),
        sendEmail(boxHolderName, boxHolderEmail, <AdminApprovalProcessEmail type="approved" />),
      ];
      await Promise.all(requests);
      showToast({
        type: 'success',
        title: `Box #${boxID} Approved`,
        message: `Box #${boxID} succesfully added to map`,
        toastPosition: 'bottom-right',
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: `Failed to Approve Box #${boxID}`,
        message: err.message,
        toastPosition: 'bottom-right',
      });
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

  // A function that changes the color of the relocation box icon depending on whether it's approved, rejected, pending, or not yet evaluated
  const getColoredIcon = () => {
    if (status === 'evaluated' && approved) {
      return ApprovedPickupIcon;
    }
    if (status === 'evaluated' && !approved) {
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
      return <h4 className={styles['status-message-approved']}>Approved by {admin}</h4>;
    }
    if (status === 'evaluated' && !approved) {
      return <h4 className={styles['status-message-rejected']}>Rejected by {admin}</h4>;
    }
    if (status === 'pending changes') {
      return <h4 className={styles['status-message-pending']}>Pending Review by {admin}</h4>;
    }
    return '';
  };

  return (
    <>
      <div
        className={`${styles.box}
        ${status === 'evaluated' && approved ? styles['box-approved'] : ''}
        ${status === 'evaluated' && !approved ? styles['box-rejected'] : ''}`}
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
              {getStatusMessage()}
              <div className={styles['box-details']}>
                {status !== 'evaluated' && verificationPicture && (
                  <>
                    <FormLabel htmlFor="verificationPicture">Box Number Verification</FormLabel>
                    <img src={verificationPicture} alt="" className={styles['image-corners']} />
                  </>
                )}
                {(status !== 'evaluated' || imageStatus !== 'rejected') && picture && (
                  <>
                    <FormLabel htmlFor="boxImage" className={styles['form-label']}>
                      Box Image
                    </FormLabel>
                    <img
                      src={picture}
                      alt=""
                      className={`${styles['image-corners']}
                      ${imageStatus === 'approved' ? `${styles['image-approved']}` : ''}
                      ${imageStatus === 'rejected' ? `${styles['image-rejected']}` : ''}`}
                    />
                  </>
                )}
                {picture && status !== 'evaluated' && (
                  <div className={styles['image-functionality-wrapper']}>
                    {/* Image approved indicator (only show if image is approved) */}
                    <div className={styles['image-functionality']}>
                      {imageStatus === 'approved' && (
                        <>
                          <button type="button" className={styles['approval-button']}>
                            <BsFillCheckCircleFill color="var(--color-success)" />
                          </button>
                          <p
                            className={`${styles['status-message']} ${styles['approval-message']}`}
                          >
                            Photo Approved
                          </p>
                        </>
                      )}
                      {/* Image rejected indicator (only show if image is rejected) */}
                      {imageStatus === 'rejected' && (
                        <>
                          <button type="button" className={styles['rejection-button']}>
                            <BsXCircleFill color="var(--color-warning)" />
                          </button>
                          <p
                            className={`${styles['status-message']} ${styles['rejection-message']}`}
                          >
                            Photo Denied
                          </p>
                        </>
                      )}
                    </div>
                    {imageStatus !== 'rejected' && imageStatus !== 'approved' && picture && (
                      <>
                        {/* Approve image button */}
                        <button
                          type="button"
                          className={styles['image-approved-button']}
                          onClick={async () => updateImageStatus('approved')}
                        >
                          <BsFillCheckCircleFill color="var(--color-success)" />
                        </button>
                        {/* Reject image button */}
                        <button
                          type="button"
                          className={styles['image-rejected-button']}
                          onClick={async () => updateImageStatus('rejected')}
                        >
                          <BsXCircleFill color="var(--color-warning)" />
                        </button>
                      </>
                    )}
                    {(imageStatus === 'rejected' || imageStatus === 'approved') && picture && (
                      <Button
                        variant="outline"
                        className={styles['undo-button']}
                        paddingTop="0px"
                        paddingBottom="0px"
                        paddingLeft="8px"
                        paddingRight="8px"
                        borderRadius="6px"
                        borderColor="var(--color-light-gray)"
                        size="sm"
                        onClick={async () => updateImageStatus('pending')}
                      >
                        Undo
                      </Button>
                    )}
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
                  {/* Box country */}
                  <FormLabel htmlFor="country" className={styles['form-label']}>
                    Country
                  </FormLabel>
                  <Input
                    readOnly
                    id="country"
                    type="country"
                    value={country ? countryList().getLabel(country) : ''}
                  />
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
    </>
  );
};

PickupBox.propTypes = {
  approved: PropTypes.bool.isRequired,
  transactionID: PropTypes.number.isRequired,
  boxID: PropTypes.number.isRequired,
  boxHolderName: PropTypes.string.isRequired,
  boxHolderEmail: PropTypes.string.isRequired,
  zipCode: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  rejectionReason: PropTypes.string.isRequired,
  pickup: PropTypes.bool.isRequired,
  fetchBoxes: PropTypes.func.isRequired,
  imageStatus: PropTypes.string.isRequired,
  admin: PropTypes.string.isRequired,
  verificationPicture: PropTypes.string.isRequired,
  reloadMap: PropTypes.func.isRequired,
};

export default PickupBox;
