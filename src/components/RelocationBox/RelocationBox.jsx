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
  Select,
  Textarea,
} from '@chakra-ui/react';

import { BsFillArrowRightCircleFill, BsFillCheckCircleFill, BsXCircleFill } from 'react-icons/bs';
import PropTypes from 'prop-types';
import RelocateBoxIcon from '../../assets/BoxIcons/RelocateBoxIcon.svg';
import PendingRelocationIcon from '../../assets/BoxIcons/PendingRelocationIcon.svg';
import RejectedRelocationIcon from '../../assets/BoxIcons/RejectedRelocationIcon.svg';
import ApprovedRelocationIcon from '../../assets/BoxIcons/ApprovedRelocationIcon.svg';
import SaveChangesIcon from '../../assets/BoxIcons/SaveChangesIcon.svg';
import { FYABackend, getLatLong, sendEmail } from '../../common/utils';
import { auth, getCurrentUser } from '../../common/auth_utils';
import ApprovedBoxEmail from '../Email/EmailTemplates/ApprovedBoxEmail';
import RequestChangesPopup from '../AlertPopups/RequestChangesPopup/RequestChangesPopup';
import RejectBoxPopup from '../AlertPopups/RejectBoxPopup/RejectBoxPopup';
import styles from './RelocationBox.module.css';

const RelocationBox = ({
  approved,
  transactionID,
  boxID,
  boxHolderName,
  boxHolderEmail,
  zipCode,
  picture,
  generalLocation,
  message,
  date,
  status,
  changesRequested,
  rejectionReason,
  messageStatus,
  fetchBoxes,
  pickup,
  launchedOrganically,
  imageStatus,
  admin,
}) => {
  // A state for determining whether or not the rejectBoxPopup is open
  // This state is set true when the reject button is clicked
  const [rejectBoxPopupIsOpen, setRejectBoxPopupIsOpen] = useState(false);
  // A state for determining whether or not the requestChangesPopup is open
  // This state is set true when the pending changes button is clicked
  const [requestChangesPopupIsOpen, setRequestChangesPopupIsOpen] = useState(false);
  // A state for the box's boxHolderName
  // This state is updated when the user edits the box holder name under pending changes
  const [boxHolderNameState, setBoxHolderNameState] = useState(boxHolderName);
  // A state for the box's boxHolderEmail
  // This state is updated when the user edits the box holder email under pending changes
  const [boxHolderEmailState, setBoxHolderEmailState] = useState(boxHolderEmail);
  // A state for the box's zip code
  // This state is updated when the user edits the zip code under pending changes
  const [zipCodeState, setZipCodeState] = useState(zipCode);
  // A state for the box's general location
  // This state is updated when the user edits the general location under pending changes
  const [generalLocationState, setGeneralLocationState] = useState(generalLocation);
  // A state for the box's message
  // This state is updated when the user edits the message under pending changes
  const [messageState, setMessageState] = useState(message);
  // A state for the box's launched organically state
  // This state is updated when the user edits the launched organically field under pending changes
  const [launchedOrganicallyState, setLaunchedOrganicallyState] = useState(launchedOrganically);

  // A function that updates box information in the backend and refetches all boxes that are under review or pending changes (message status can be updated in 'under review')
  // This method is called when the save button is clicked under pending changes
  const updateBoxInfo = async newStatus => {
    const user = await getCurrentUser(auth);
    const userInDB = await FYABackend.get(`/users/userId/${user.uid}`);
    await FYABackend.put('/boxHistory/update', {
      transactionID,
      boxID,
      status: newStatus,
      boxHolderName: boxHolderNameState,
      boxHolderEmail: boxHolderEmailState,
      zipCode: zipCodeState,
      generalLocation: generalLocationState,
      message: messageState,
      launchedOrganically: launchedOrganicallyState,
      admin: `${userInDB.data.user.first_name} ${userInDB.data.user.last_name}`,
    });

    const requests = [fetchBoxes('under review', false), fetchBoxes('pending changes', false)];
    await Promise.all(requests);
  };

  // A function that approves a relocation box submission and updates the backend state accordingly and then refetches all boxes (boxes can be approved from any tab)
  const approveRelocationBox = async () => {
    const user = await getCurrentUser(auth);
    const userInDB = await FYABackend.get(`/users/userId/${user.uid}`);
    await FYABackend.put('/boxHistory/update', {
      transactionID,
      boxID,
      status,
      boxHolderName: boxHolderNameState,
      boxHolderEmail: boxHolderEmailState,
      zipCode: zipCodeState,
      generalLocation: generalLocationState,
      message: messageState,
      launchedOrganically: launchedOrganicallyState,
      admin: `${userInDB.data.user.first_name} ${userInDB.data.user.last_name}`,
    });
    // TODO: REPLACE USA WITH COUNTRY INPUT
    let coordinates = await getLatLong(zipCode, 'USA');
    if (coordinates.length !== 2) {
      coordinates = [0, 0];
    }

    await FYABackend.put('/boxHistory/approveBox', {
      transactionID,
      latitude: coordinates[0],
      longitude: coordinates[1],
    });
    const requests = [
      fetchBoxes('under review', false),
      fetchBoxes('pending changes', false),
      fetchBoxes('evaluated', false),
      sendEmail(
        boxHolderNameState,
        boxHolderEmailState,
        <ApprovedBoxEmail boxHolderName={boxHolderName} />,
      ),
    ];
    await Promise.all(requests);
  };

  // A function that updates imageStatus in the backend when a user clicks on the accept/reject buttons below the box's image
  const updateImageStatus = async newStatus => {
    await FYABackend.put('/boxHistory/update', {
      transactionID,
      boxID,
      imageStatus: newStatus,
    });
    await fetchBoxes(status, false);
  };

  // A function that updates imageStatus in the backend when a user clicks on the accept/reject buttons below the message
  const updateMessageStatus = async newStatus => {
    await FYABackend.put('/boxHistory/update', {
      transactionID,
      boxID,
      messageStatus: newStatus,
    });
    await fetchBoxes(status, false);
  };

  // A function that handles when the middle button (move to pending changes or save changes) is clicked
  const handleMiddleButtonClicked = async () => {
    if (status === 'under review') {
      setRequestChangesPopupIsOpen(!requestChangesPopupIsOpen);
    } else {
      await updateBoxInfo('pending changes');
    }
  };

  // A function that changes the color of the relocation box icon depending on whether it's approved, rejected, pending, or not yet evaluated
  const getColoredIcon = () => {
    if (status === 'evaluated' && approved) {
      return ApprovedRelocationIcon;
    }
    if (status === 'evaluated' && !approved) {
      return RejectedRelocationIcon;
    }
    if (status === 'pending changes') {
      return PendingRelocationIcon;
    }
    return RelocateBoxIcon;
  };

  // A function that creates the string that identifies which admin evaluated the box
  const getStatusMessage = () => {
    if (status === 'evaluated' && approved) {
      return `Approved by ${admin}`;
    }
    if (status === 'evaluated' && !approved) {
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
        // Conditional classes for approved/pending changes/rejected boxes to determine background coloring
        className={`${styles.box}
        ${status === 'evaluated' && approved ? styles['box-approved'] : ''}
        ${status === 'evaluated' && !approved ? styles['box-rejected'] : ''}
        ${status === 'pending changes' ? styles['box-pending'] : ''}`}
      >
        <Accordion allowToggle>
          <AccordionItem>
            <h3>
              <AccordionButton className={styles['accordion-button']}>
                {/* Relocation box icon */}
                <div className={styles['picture-div']}>
                  <img src={getColoredIcon()} alt=" " width="100%" height="auto" />
                </div>
                {/* Box Number & date */}
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

            {/* Box picture */}
            <AccordionPanel pb={4} className={styles['accordion-panel']}>
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
                          <p
                            className={`${styles['status-message']} ${styles['approval-message']}`}
                          >
                            Image Approved
                          </p>
                        </>
                      )}
                      {/* Image rejected indicator (only show if image is rejected) */}
                      {imageStatus === 'rejected' && (
                        <>
                          <button type="button" className={styles['rejection-button']}>
                            <BsXCircleFill color="red" />
                          </button>
                          <p
                            className={`${styles['status-message']} ${styles['rejection-message']}`}
                          >
                            Image Denied
                          </p>
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
                {/* Box Name */}
                <FormControl>
                  <FormLabel htmlFor="name" className={styles['form-label']}>
                    Name
                  </FormLabel>
                  <Input
                    isReadOnly={status !== 'pending changes'}
                    id="name"
                    // type="text"
                    value={boxHolderNameState}
                    onChange={e => setBoxHolderNameState(e.target.value)}
                  />
                  {/* Box Email */}
                  <FormLabel htmlFor="email" className={styles['form-label']}>
                    Email
                  </FormLabel>
                  <Input
                    isReadOnly={status !== 'pending changes'}
                    id="email"
                    type="text"
                    value={boxHolderEmailState}
                    onChange={e => setBoxHolderEmailState(e.target.value)}
                  />
                  {/* Box Zip Code */}
                  <FormLabel htmlFor="zipCode" className={styles['form-label']}>
                    Zip Code
                  </FormLabel>
                  <Input
                    isReadOnly={status !== 'pending changes'}
                    id="zipCode"
                    type="text"
                    value={zipCodeState}
                    onChange={e => setZipCodeState(e.target.value)}
                  />
                  <FormLabel htmlFor="generalLocation" className={styles['form-label']}>
                    General Location
                  </FormLabel>
                  <Input
                    isReadOnly={status !== 'pending changes'}
                    id="generalLocation"
                    type="text"
                    value={generalLocationState}
                    onChange={e => setGeneralLocationState(e.target.value)}
                  />
                  {/* Box's Launched Organically field */}
                  <FormLabel htmlFor="launchedOrganically" className={styles['form-label']}>
                    Drop Off Method
                  </FormLabel>
                  <Select
                    disabled={status !== 'pending changes'}
                    defaultValue={launchedOrganicallyState}
                    onChange={e => setLaunchedOrganicallyState(e.target.value)}
                  >
                    <option value>Dropped at Location</option>
                    <option value={false}>Given to Someone</option>
                  </Select>
                  {/* Box's message (only show if the box isn't evaluated or message isn't rejected) */}
                  {!(status === 'evaluated' && messageStatus === 'rejected') && (
                    <>
                      <FormLabel htmlFor="Message" className={styles['form-label']}>
                        Message
                      </FormLabel>
                      <Textarea
                        className={`${
                          messageStatus === 'approved' ? `${styles['message-approved']}` : ''
                        }
                        ${messageStatus === 'rejected' ? `${styles['message-rejected']}` : ''}`}
                        isReadOnly={status !== 'pending changes'}
                        value={messageState}
                        onChange={e => setMessageState(e.target.value)}
                      />
                    </>
                  )}
                  {/* Message button toolbar (Only show if box hasn't been evaluted yet) */}
                  {status !== 'evaluated' && (
                    <div className={styles['message-functionality-wrapper']}>
                      {/* Message approved indicator (only show if message is approved) */}
                      <div className={styles['message-functionality']}>
                        {messageStatus === 'approved' && (
                          <>
                            <button type="button" className={styles['approval-button']}>
                              <BsFillCheckCircleFill color="green" />
                            </button>
                            <p
                              className={`${styles['status-message']} ${styles['approval-message']}`}
                            >
                              Message Approved
                            </p>
                          </>
                        )}
                        {/* Message rejected indicator (only show if message is rejected) */}
                        {messageStatus === 'rejected' && (
                          <>
                            <button type="button" className={styles['rejection-button']}>
                              <BsXCircleFill color="red" />
                            </button>
                            <p
                              className={`${styles['status-message']} ${styles['rejection-message']}`}
                            >
                              Message Denied
                            </p>
                          </>
                        )}
                      </div>
                      {/* Approve message button */}
                      <button
                        type="button"
                        className={styles['message-approved-button']}
                        onClick={async () => updateMessageStatus('approved')}
                      >
                        <BsFillCheckCircleFill color="green" />
                      </button>
                      {/* Reject message button */}
                      <button
                        type="button"
                        className={styles['message-rejected-button']}
                        onClick={async () => updateMessageStatus('rejected')}
                      >
                        <BsXCircleFill color="red" />
                      </button>
                    </div>
                  )}
                  {/* Changes requested text area (only show if box is under pending changes) */}
                  {status === 'pending changes' && (
                    <div>
                      <FormLabel htmlFor="changesRequested" className={styles['form-label']}>
                        Changes Requested
                      </FormLabel>
                      <Textarea isReadOnly value={changesRequested} resize="vertical" />
                    </div>
                  )}
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
                        onClick={async () => setRejectBoxPopupIsOpen(!rejectBoxPopupIsOpen)}
                      >
                        <BsXCircleFill className={styles['reject-box-icon']} />
                      </button>
                    </div>
                    {/* Pending changes (if the box is under review) or Save (if the box is under pending changes) button */}
                    <div className={styles['arrow-forward-icon']}>
                      <button type="button" onClick={async () => handleMiddleButtonClicked()}>
                        {status === 'under review' ? (
                          <BsFillArrowRightCircleFill className={styles['request-changes-icon']} />
                        ) : (
                          <img src={SaveChangesIcon} alt="save" />
                        )}
                      </button>
                    </div>
                    {/* Accept box button */}
                    <div className={styles['check-icon']}>
                      <button type="button" onClick={async () => approveRelocationBox(boxID)}>
                        <BsFillCheckCircleFill className={styles['approve-box-icon']} />
                      </button>
                    </div>
                  </div>
                )}
                <RequestChangesPopup
                  boxHolderName={boxHolderNameState}
                  boxHolderEmail={boxHolderEmail}
                  isOpen={requestChangesPopupIsOpen}
                  setIsOpen={setRequestChangesPopupIsOpen}
                  transactionID={transactionID}
                  boxID={boxID}
                  pickup={pickup}
                  fetchBoxes={fetchBoxes}
                />
                <RejectBoxPopup
                  boxHolderName={boxHolderNameState}
                  boxHolderEmail={boxHolderEmail}
                  isOpen={rejectBoxPopupIsOpen}
                  setIsOpen={setRejectBoxPopupIsOpen}
                  transactionID={transactionID}
                  boxID={boxID}
                  pickup={pickup}
                  fetchBoxes={fetchBoxes}
                />
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </ChakraProvider>
  );
};

RelocationBox.propTypes = {
  approved: PropTypes.bool.isRequired,
  transactionID: PropTypes.number.isRequired,
  boxID: PropTypes.number.isRequired,
  boxHolderName: PropTypes.string.isRequired,
  boxHolderEmail: PropTypes.string.isRequired,
  zipCode: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
  generalLocation: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  changesRequested: PropTypes.string.isRequired,
  rejectionReason: PropTypes.string.isRequired,
  messageStatus: PropTypes.string.isRequired,
  fetchBoxes: PropTypes.func.isRequired,
  pickup: PropTypes.bool.isRequired,
  launchedOrganically: PropTypes.bool.isRequired,
  imageStatus: PropTypes.string.isRequired,
  admin: PropTypes.string.isRequired,
};

export default RelocationBox;
