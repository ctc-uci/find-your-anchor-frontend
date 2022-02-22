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

import './RelocationBox.css';
import PropTypes from 'prop-types';
import ApproveBoxIcon from '../BoxIcons/ApproveBoxIcon.svg';
import RejectBoxIcon from '../BoxIcons/RejectBoxIcon.svg';
import RelocateBoxIcon from '../BoxIcons/RelocateBoxIcon.svg';
import RequestChangesIcon from '../BoxIcons/RequestChangesIcon.svg';
import SaveChangesIcon from '../BoxIcons/SaveChangesIcon.svg';
import utils from '../../common/utils';
import RequestChangesPopup from '../AlertPopups/RequestChangesPopup/RequestChangesPopup';
import RejectBoxPopup from '../AlertPopups/RejectBoxPopup/RejectBoxPopup';
import MessageApprovedIcon from '../BoxIcons/MessageApprovedIcon.svg';
import MessageRejectedIcon from '../BoxIcons/MessageRejectedIcon.svg';
import ImageVector from '../BoxIcons/ImageVector.svg';

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
  dropOffMethod,
}) => {
  const [rejectBoxPopupIsOpen, setRejectBoxPopupIsOpen] = useState(false);
  const [requestChangesPopupIsOpen, setRequestChangesPopupIsOpen] = useState(false);
  const [boxHolderNameState, setBoxHolderNameState] = useState(boxHolderName);
  const [boxHolderEmailState, setBoxHolderEmailState] = useState(boxHolderEmail);
  const [zipCodeState, setZipCodeState] = useState(zipCode);
  const [generalLocationState, setGeneralLocationState] = useState(generalLocation);
  const [messageState, setMessageState] = useState(message);
  const [messageStatusState, setMessageStatusState] = useState(messageStatus);
  const [dropOffMethodState, setDropOffMethodState] = useState(dropOffMethod);

  const updateBoxInfo = async stat => {
    await utils.put('/boxHistory/update', {
      boxID,
      status: stat,
      boxHolderName: boxHolderNameState,
      boxHolderEmail: boxHolderEmailState,
      zipCode: zipCodeState,
      generalLocation: generalLocationState,
      message: messageState,
      messageStatus: messageStatusState,
      dropOffMethod: dropOffMethodState,
    });

    const requests = [fetchBoxes('under review', false), fetchBoxes('pending changes', false)];
    await Promise.all(requests);
  };

  const approveRelocationBoxFromUR = async id => {
    await utils.put('/boxHistory/update', {
      boxID,
      status,
      boxHolderName: boxHolderNameState,
      boxHolderEmail: boxHolderEmailState,
      zipCode: zipCodeState,
      generalLocation: generalLocationState,
      message: messageState,
      messageStatus: messageStatusState,
      dropOffMethod: dropOffMethodState,
    });
    await utils.put('/boxHistory/approveBox', {
      boxID: id,
    });
    const requests = [
      fetchBoxes('under review', false),
      fetchBoxes('pending changes', false),
      fetchBoxes('evaluated', false),
    ];
    await Promise.all(requests);
  };

  return (
    <ChakraProvider>
      <div
        className={`box ${status === 'evaluated' && approved ? 'box-approved' : ''}
        ${status === 'evaluated' && approved === false ? 'box-rejected' : ''}
        ${status === 'pending changes' ? 'box-pending' : ''}`}
      >
        <Accordion allowToggle>
          <AccordionItem>
            <h3>
              <AccordionButton>
                <div className="picture-div">
                  <img src={RelocateBoxIcon} alt=" " />
                </div>
                <div className="title-div">
                  <p className="title">
                    <p className="box-number">Box #{boxID}</p>
                    {date}
                  </p>
                </div>
                <div className="arrow-button">
                  <AccordionIcon />
                </div>
              </AccordionButton>
            </h3>
            <AccordionPanel pb={4} className="accordion-panel">
              <div className="box-details">
                {picture !== null && <img src={picture} alt="" className="image-corners" />}
                {picture === null && (
                  <div className="image-box">
                    <img className="image-vector" src={ImageVector} alt="" />
                  </div>
                )}
                <FormControl>
                  <FormLabel htmlFor="name" marginTop="5%">
                    Name
                  </FormLabel>
                  <Input
                    isReadOnly={status !== 'pending changes'}
                    id="name"
                    // type="text"
                    value={boxHolderNameState}
                    onChange={e => setBoxHolderNameState(e.target.value)}
                  />
                  <FormLabel htmlFor="email" marginTop="5%">
                    Email
                  </FormLabel>
                  <Input
                    isReadOnly={status !== 'pending changes'}
                    id="email"
                    type="text"
                    value={boxHolderEmailState}
                    onChange={e => setBoxHolderEmailState(e.target.value)}
                  />
                  {/* ***************************ZIP CODE ************************************ */}
                  <FormLabel htmlFor="zipCode" marginTop="5%">
                    Zip Code
                  </FormLabel>
                  <Input
                    isReadOnly={status !== 'pending changes'}
                    id="zipCode"
                    type="number"
                    value={zipCodeState}
                    onChange={e => setZipCodeState(e.target.value)}
                  />
                  <FormLabel htmlFor="generalLocation" marginTop="5%">
                    General Location
                  </FormLabel>
                  <Input
                    isReadOnly={status !== 'pending changes'}
                    id="generalLocation"
                    type="text"
                    value={generalLocationState}
                    onChange={e => setGeneralLocationState(e.target.value)}
                  />
                  <FormLabel htmlFor="dropOffMethod" marginTop="5%">
                    Drop Off Method
                  </FormLabel>
                  <Select
                    disabled={status !== 'pending changes'}
                    defaultValue={dropOffMethodState}
                    onChange={e => setDropOffMethodState(e.target.value)}
                  >
                    <option value="Given to Someone">Given to Someone</option>
                    <option value="Left at Location">Left at Location</option>
                  </Select>
                  {!(status === 'evaluated' && messageStatus === 'rejected') && (
                    <>
                      <FormLabel htmlFor="Message" marginTop="5%">
                        Message
                      </FormLabel>
                      <Textarea
                        className={`${messageStatus === 'approved' ? 'message-approved' : ''}
                        ${messageStatus === 'rejected' ? 'message-rejected' : ''}`}
                        isReadOnly={status !== 'pending changes'}
                        value={messageState}
                        onChange={e => setMessageState(e.target.value)}
                      />
                      <div className="message-functionality">
                        {messageStatus === 'approved' && (
                          <>
                            <button type="button" className="approval-button">
                              <img src={MessageApprovedIcon} alt="" />
                            </button>
                            <p className="approval-message">Message Approved</p>
                          </>
                        )}
                        {messageStatus === 'rejected' && (
                          <>
                            <button type="button" className="rejection-button">
                              <img src={MessageRejectedIcon} alt="" />
                            </button>
                            <p className="rejection-message">Message Denied</p>
                          </>
                        )}
                      </div>
                    </>
                  )}
                  {status !== 'evaluated' && (
                    <>
                      <button
                        type="button"
                        className="message-approved"
                        onClick={async () => {
                          setMessageStatusState('approved');
                          await utils.put('/boxHistory/update', {
                            boxID,
                            messageStatus: 'approved',
                          });
                          await fetchBoxes(status, false);
                        }}
                      >
                        <img src={MessageApprovedIcon} alt="" />
                      </button>
                      <button
                        type="button"
                        className="message-rejected"
                        onClick={async () => {
                          setMessageStatusState('rejected');
                          await utils.put('/boxHistory/update', {
                            boxID,
                            messageStatus: 'rejected',
                          });
                          await fetchBoxes(status, false);
                        }}
                      >
                        <img src={MessageRejectedIcon} alt="" />
                      </button>
                    </>
                  )}
                  {status === 'pending changes' && (
                    <div>
                      <FormLabel htmlFor="changesRequested" marginTop="5%">
                        Changes Requested
                      </FormLabel>
                      <Textarea isReadOnly value={changesRequested} resize="vertical" />
                    </div>
                  )}
                  {status === 'evaluated' && !approved && (
                    <>
                      <FormLabel htmlFor="rejectionReason" marginTop="5%">
                        Rejection Reason
                      </FormLabel>
                      <Textarea isReadOnly value={rejectionReason} resize="vertical" />
                    </>
                  )}
                </FormControl>

                {status !== 'evaluated' && (
                  <div className="icon-row">
                    <div className="close-icon">
                      <button
                        type="button"
                        onClick={async () => {
                          setRejectBoxPopupIsOpen(!rejectBoxPopupIsOpen);
                        }}
                      >
                        <img src={RejectBoxIcon} alt="" />
                      </button>
                    </div>
                    <div className="arrow-forward-icon">
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
                        <img
                          src={status === 'under review' ? RequestChangesIcon : SaveChangesIcon}
                          alt=""
                        />
                      </button>
                    </div>
                    <div className="check-icon">
                      <button
                        type="button"
                        onClick={async () => {
                          await approveRelocationBoxFromUR(boxID);
                        }}
                      >
                        <img src={ApproveBoxIcon} alt="" />
                      </button>
                    </div>
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
                )}
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
  dropOffMethod: PropTypes.string.isRequired,
};

export default RelocationBox;
