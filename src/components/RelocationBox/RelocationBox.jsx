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
  // setRelocationBoxesUnderReview,
  // setRelocationBoxesEvaluated,
  // setRelocationBoxesPending,
  fetchBoxes,
}) => {
  // key={boxData.box_id}
  //             box_id={boxData.box_id}
  //             boxholder_name={boxData.boxholder_name}
  //             boxholder_email={boxData.boxholder_email}
  //             zip_code={boxData.zip_code}
  //             picture={boxData.picture}
  //             genera_location={boxData.general_location}
  //             message={boxData.message}
  //             date={boxData.date}
  const [requestChangesPopupIsOpen, setRequestChangesPopupIsOpen] = useState(false);
  const [boxHolderNameState, setBoxHolderNameState] = useState(boxHolderName);
  const [boxHolderEmailState, setBoxHolderEmailState] = useState(boxHolderEmail);
  const [zipCodeState, setZipCodeState] = useState(zipCode);
  const [generalLocationState, setGeneralLocationState] = useState(generalLocation);
  const [messageState, setMessageState] = useState(message);

  const updateBoxStatus = async (id, stat) => {
    await utils.put('/box/relocationBoxes/update', {
      boxID: id,
      status: stat,
      boxHolderNameState,
      boxHolderEmailState,
      zipCodeState,
      generalLocationState,
      messageState,
    });
    // const requests = [fetchBoxes('under review', false)];
    const requests = [fetchBoxes('under review', false), fetchBoxes('pending changes', false)];
    await Promise.all(requests);
    // const relocationBoxesUnderReview = await fetchBoxes('under review', false);
    // setRelocationBoxesUnderReview(relocationBoxesUnderReview);
    // const relocationBoxesEvaluated = await fetchBoxes('evaluated', false);
    // setRelocationBoxesEvaluated(relocationBoxesEvaluated);
    // const relocationBoxesPending = await fetchBoxes('pending changes', false);
    // setRelocationBoxesPending(relocationBoxesPending);
  };

  const approveRelocationBoxFromUR = async id => {
    await utils.put('/box/approveBox', {
      boxID: id,
    });
    const requests = [fetchBoxes('under review', false), fetchBoxes('pending changes', false)];
    await Promise.all(requests);
    // const relocationBoxesUnderReview = await fetchBoxes('under review', false);
    // setRelocationBoxesUnderReview(relocationBoxesUnderReview);
    // const relocationBoxesEvaluated = await fetchBoxes('evaluated', false);
    // setRelocationBoxesEvaluated(relocationBoxesEvaluated);
    // const relocationBoxesPending = await fetchBoxes('pending changes', false);
    // setRelocationBoxesPending(relocationBoxesPending);
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
                <div className="pictureDiv">
                  <img src={RelocateBoxIcon} alt=" " />
                </div>
                <div className="titleDiv">
                  <p className="title">
                    <p className="boxNumber">Box #{boxID}</p>
                    {date}
                  </p>
                </div>
                <div className="arrowButton">
                  <AccordionIcon />
                </div>
              </AccordionButton>
            </h3>
            <AccordionPanel pb={4}>
              <div className="boxDetails">
                <img src={picture} alt=" " className="imageCorners" />
                <FormControl>
                  <FormLabel htmlFor="name" marginTop="5%">
                    Name
                  </FormLabel>
                  <Input
                    isReadOnly={status !== 'pending changes'}
                    id="name"
                    type="text"
                    value={boxHolderName}
                    onChange={e => setBoxHolderNameState(e.target.value)}
                  />
                  <FormLabel htmlFor="email" marginTop="5%">
                    Email
                  </FormLabel>
                  <Input
                    isReadOnly={status !== 'pending changes'}
                    id="email"
                    type="text"
                    value={boxHolderEmail}
                    onChange={e => setBoxHolderEmailState(e.target.value)}
                  />
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
                  <Select id="generalLocation" placeholder="Select Method">
                    <option> Given to Someone</option>
                    <option> Left at Location</option>
                  </Select>
                  <FormLabel htmlFor="Message" marginTop="5%">
                    Message
                  </FormLabel>
                  <Textarea
                    isReadOnly={status !== 'pending changes'}
                    value={messageState}
                    onChange={e => setMessageState(e.target.value)}
                  />
                  {status === 'pending changes' && (
                    <>
                      <FormLabel htmlFor="changesRequested" marginTop="5%">
                        Changes Requested
                      </FormLabel>
                      <Textarea value={message} resize="vertical" />
                    </>
                  )}
                </FormControl>

                {status !== 'evaluated' && (
                  <div className="iconRow">
                    <div className="closeIcon">
                      <button
                        type="button"
                        onClick={() => {
                          updateBoxStatus(boxID, 'evaluated');
                        }}
                      >
                        <img src={RejectBoxIcon} alt="" />
                      </button>
                    </div>
                    <div className="arrowForwardIcon">
                      <button
                        type="button"
                        onClick={async () => {
                          if (status === 'under review') {
                            setRequestChangesPopupIsOpen(!requestChangesPopupIsOpen);
                          }
                          // await updateBoxStatus(boxID, 'pending changes');
                        }}
                      >
                        <img
                          src={status === 'under review' ? RequestChangesIcon : SaveChangesIcon}
                          alt=""
                        />
                      </button>
                    </div>
                    <div className="checkIcon">
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
                      boxHolderNameState
                      boxHolderEmailState
                      zipCodeState
                      generalLocationState
                      messageState
                      fetchBoxes
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
  fetchBoxes: PropTypes.func.isRequired,
};

export default RelocationBox;
