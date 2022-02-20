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

import './PickupBox.css';
import PropTypes from 'prop-types';
import RejectBoxPopup from '../AlertPopups/RejectBoxPopup/RejectBoxPopup';
import ApproveBoxIcon from '../BoxIcons/ApproveBoxIcon.svg';
import RejectBoxIcon from '../BoxIcons/RejectBoxIcon.svg';
import PickupBoxIcon from '../BoxIcons/PickupBoxIcon.svg';
import ImageVector from '../BoxIcons/ImageVector.svg';
import FYABackend from '../../common/utils';
// import RequestChangesIcon from '../BoxIcons/RequestChangesIcon.svg';

function PickupBox({
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
  // setPickupBoxesUnderReview,
  // setPickupBoxesEvaluated,
}) {
  const [rejectBoxPopupIsOpen, setRejectBoxPopupIsOpen] = useState(false);

  const approvePickupBoxFromUR = async id => {
    FYABackend.put('/box/approveBox', {
      boxID: id,
    }).then(async () => {
      await fetchBoxes('under review', true);
    });
  };

  return (
    <ChakraProvider>
      <div
        className={`box ${status === 'evaluated' && approved === true ? 'box-approved' : ''}
        ${status === 'evaluated' && approved === false ? 'box-rejected' : ''}`}
      >
        <Accordion allowToggle>
          <AccordionItem>
            <h3>
              <AccordionButton>
                <img src={PickupBoxIcon} alt="" />
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
            <AccordionPanel className="accordion-panel" pb={4}>
              <div className="box-details">
                {picture !== null && <img src={picture} alt="" className="pickup-image-corners" />}
                {picture === null && (
                  <div className="image-box">
                    <img className="image-vector" src={ImageVector} alt="" />
                  </div>
                )}
                <FormControl>
                  <FormLabel htmlFor="name" marginTop="5%">
                    Name
                  </FormLabel>
                  <Input isReadOnly id="name" type="name" placeholder={boxHolderName} />

                  <FormLabel isReadOnly htmlFor="email" marginTop="5%">
                    Email
                  </FormLabel>
                  <Input isReadOnly id="email" type="email" placeholder={boxHolderEmail} />
                  <FormLabel htmlFor="zipCode" marginTop="5%">
                    Zip Code
                  </FormLabel>
                  <Input isReadOnly id="zipCode" type="zipCode" placeholder={zipCode} />
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
                        onClick={() => {
                          setRejectBoxPopupIsOpen(!rejectBoxPopupIsOpen);
                        }}
                      >
                        <img src={RejectBoxIcon} alt="" />
                      </button>
                    </div>
                    <div className="check-icon">
                      <button
                        type="button"
                        onClick={() => {
                          approvePickupBoxFromUR(boxID);
                        }}
                      >
                        <img src={ApproveBoxIcon} alt="" />
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
}

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
