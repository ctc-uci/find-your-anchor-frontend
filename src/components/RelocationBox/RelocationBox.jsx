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
import CustomToast from '../CustomToast/CustomToast';
import RelocateBoxIcon from '../BoxIcons/RelocateBoxIcon.svg';
import SaveChangesIcon from '../BoxIcons/SaveChangesIcon.svg';
import { FYABackend } from '../../common/utils';
import RequestChangesPopup from '../AlertPopups/RequestChangesPopup/RequestChangesPopup';
import RejectBoxPopup from '../AlertPopups/RejectBoxPopup/RejectBoxPopup';
import styles from './RelocationBox.module.css';

const RelocationBox = ({
  approved,
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
  toast,
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
  // A state for the box's message status
  // This state is updated when the user approves or rejects the message under pending changes
  const [messageStatusState, setMessageStatusState] = useState(messageStatus);
  // A state for the box's launched organically state
  // This state is updated when the user edits the launched organically field under pending changes
  const [launchedOrganicallyState, setLaunchedOrganicallyState] = useState(launchedOrganically);

  // A function that updates box information in the backend and refetches all boxes that are under review or pending changes (message status can be updated in 'under review')
  // This method is called when the save button is clicked under pending changes

  const updateBoxInfo = async stat => {
    await FYABackend.put('/boxHistory/update', {
      boxID,
      status: stat,
      boxHolderName: boxHolderNameState,
      boxHolderEmail: boxHolderEmailState,
      zipCode: zipCodeState,
      generalLocation: generalLocationState,
      message: messageState,
      messageStatus: messageStatusState,
      launchedOrganically: launchedOrganicallyState,
    });

    const requests = [fetchBoxes('under review', false), fetchBoxes('pending changes', false)];
    await Promise.all(requests);
  };
  const showToast = CustomToast(toast, {
    icon: 'success',
    title: `Box # Approved`,
    message: '',
    toastPosition: 'bottom-right',
  });
  const errorToast = CustomToast(toast, {
    icon: 'error',
    title: `Box # Approved`,
    message: '',
    toastPosition: 'bottom-right',
  });
  // A function that approves a relocation box submission and updates the backend state accordingly and then refetches all boxes (boxes can be approved from any tab)
  const approveRelocationBox = async id => {
    try {
      await FYABackend.put('/boxHistory/update', {
        boxID,
        status,
        boxHolderName: boxHolderNameState,
        boxHolderEmail: boxHolderEmailState,
        zipCode: zipCodeState,
        generalLocation: generalLocationState,
        message: messageState,
        messageStatus: messageStatusState,
        launchedOrganically: launchedOrganicallyState,
      });
      const globalBoxID = id;

      await FYABackend.put('/boxHistory/approveBox', {
        boxID: globalBoxID,
      });

      const requests = [
        fetchBoxes('under review', false),
        fetchBoxes('pending changes', false),
        fetchBoxes('evaluated', false),
      ];
      await Promise.all(requests);
      showToast();
    } catch (err) {
      errorToast();
    }
  };

  return (
    <ChakraProvider>
      <div
        // Conditional classes for approved/pending changes/rejected boxes to determine background coloring
        className={`${styles.box}
        ${status === 'evaluated' && approved ? styles['box-approved'] : ''}
        ${status === 'evaluated' && approved === false ? styles['box-rejected'] : ''}
        ${status === 'pending changes' ? styles['box-pending'] : ''}`}
      >
        <Accordion allowToggle>
          <AccordionItem>
            <h3>
              <AccordionButton className={styles['accordion-button']}>
                {/* Relocation box icon */}
                <div className={styles['picture-div']}>
                  <img src={RelocateBoxIcon} alt=" " />
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
              <div className={styles['box-details']}>
                {picture !== null && (
                  <img src={picture} alt="" className={styles['pickup-image-corners']} />
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
                            <p className={styles['approval-message']}>Message Approved</p>
                          </>
                        )}
                        {/* Message rejected indicator (only show if message is rejected) */}
                        {messageStatus === 'rejected' && (
                          <>
                            <button type="button" className={styles['rejection-button']}>
                              <BsXCircleFill color="red" />
                            </button>
                            <p className={styles['rejection-message']}>Message Denied</p>
                          </>
                        )}
                      </div>
                      {/* Approve message button */}
                      <button
                        type="button"
                        className={styles['message-approved']}
                        onClick={async () => {
                          setMessageStatusState('approved');
                          await FYABackend.put('/boxHistory/update', {
                            boxID,
                            messageStatus: 'approved',
                          });
                          await fetchBoxes(status, false);
                        }}
                      >
                        <BsFillCheckCircleFill color="green" />
                      </button>
                      {/* Reject message button */}
                      <button
                        type="button"
                        className={styles['message-rejected']}
                        onClick={async () => {
                          setMessageStatusState('rejected');
                          await FYABackend.put('/boxHistory/update', {
                            boxID,
                            messageStatus: 'rejected',
                          });
                          await fetchBoxes(status, false);
                        }}
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
                        onClick={async () => {
                          setRejectBoxPopupIsOpen(!rejectBoxPopupIsOpen);
                        }}
                      >
                        <BsXCircleFill color="red" size="30px" />
                      </button>
                    </div>
                    {/* Pending changes (if the box is under review) or Save (if the box is under pending changes) button */}
                    <div className={styles['arrow-forward-icon']}>
                      <button
                        type="button"
                        onClick={async () => {
                          if (status === 'under review') {
                            setRequestChangesPopupIsOpen(!requestChangesPopupIsOpen);
                          } else {
                            await updateBoxInfo('pending changes');
                          }
                        }}
                      >
                        {status === 'under review' ? (
                          <BsFillArrowRightCircleFill color="yellow" size="30px" />
                        ) : (
                          <img src={SaveChangesIcon} alt="save" />
                        )}
                      </button>
                    </div>
                    {/* Accept box button */}
                    <div className={styles['check-icon']}>
                      <button
                        type="button"
                        onClick={async () => {
                          await approveRelocationBox(boxID)
                            .then(() => {
                              showToast();
                            })
                            .catch(() => {
                              errorToast();
                            });
                        }}
                      >
                        <BsFillCheckCircleFill color="green" size="30px" />
                      </button>
                    </div>
                  </div>
                )}
                <RequestChangesPopup
                  isOpen={requestChangesPopupIsOpen}
                  setIsOpen={setRequestChangesPopupIsOpen}
                  boxID={boxID}
                  pickup={pickup}
                  fetchBoxes={fetchBoxes}
                />
                <RejectBoxPopup
                  isOpen={rejectBoxPopupIsOpen}
                  setIsOpen={setRejectBoxPopupIsOpen}
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
  boxID: PropTypes.number.isRequired,
  boxHolderName: PropTypes.string.isRequired,
  boxHolderEmail: PropTypes.string.isRequired,
  zipCode: PropTypes.number.isRequired,
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
  toast: PropTypes.func.isRequired,
};

export default RelocationBox;
