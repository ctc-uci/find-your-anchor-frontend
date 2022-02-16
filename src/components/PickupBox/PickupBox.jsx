import { React } from 'react';
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
} from '@chakra-ui/react';

import './PickupBox.css';
import PropTypes from 'prop-types';
// import RejectBoxPopup from '../AlertPopups/RejectBoxPopup/RejectBoxPopup';
import ApproveBoxIcon from '../BoxIcons/ApproveBoxIcon.svg';
import RejectBoxIcon from '../BoxIcons/RejectBoxIcon.svg';
import PickupBoxIcon from '../BoxIcons/PickupBoxIcon.svg';
import utils from '../../common/utils';
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
  fetchBoxes,
  // setPickupBoxesUnderReview,
  // setPickupBoxesEvaluated,
}) {
  PickupBox.propTypes = {
    approved: PropTypes.bool.isRequired,
    boxID: PropTypes.number.isRequired,
    boxHolderName: PropTypes.string.isRequired,
    boxHolderEmail: PropTypes.string.isRequired,
    zipCode: PropTypes.number.isRequired,
    picture: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    fetchBoxes: PropTypes.func.isRequired,
    // setPickupBoxesUnderReview: PropTypes.func.isRequired,
    // setPickupBoxesEvaluated: PropTypes.func.isRequired,
  };

  const updateBoxStatus = async (id, stat) => {
    utils
      .put('/box/updateStatus', {
        boxID: id,
        status: stat,
      })
      .then(async () => {
        await fetchBoxes('under review', true);
        // const pickupBoxesUnderReview = await fetchBoxes('under review', true);
        // setPickupBoxesUnderReview(pickupBoxesUnderReview);
        // const pickupBoxesEvaluated = await fetchBoxes('evaluated', true);
        // setPickupBoxesEvaluated(pickupBoxesEvaluated);
      });
  };

  const approvePickupBoxFromUR = async id => {
    utils
      .put('/box/approveBox', {
        boxID: id,
      })
      .then(async () => {
        await fetchBoxes('under review', true);
        // const pickupBoxesUnderReview = await fetchBoxes('under review', true);
        // setPickupBoxesUnderReview(pickupBoxesUnderReview);
        // const pickupBoxesEvaluated = await fetchBoxes('evaluated', true);
        // setPickupBoxesEvaluated(pickupBoxesEvaluated);
      });
  };

  // const rejectPickupBoxFromUR = id => {
  //   utils.put('/pickupBoxes/rejected', {
  //     boxID: id,
  //   });
  // };

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
                <img src={picture} alt="" className="pickUpImageCorners" />
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
                </FormControl>
                {status !== 'evaluated' && (
                  <div className="iconRow">
                    <div className="closeIcon">
                      <button
                        type="button"
                        onClick={() => {
                          updateBoxStatus(boxID, 'evaluated');
                          // <RejectBoxPopup />;
                        }}
                      >
                        <img src={RejectBoxIcon} alt="" />
                      </button>
                    </div>
                    <div className="checkIcon">
                      <button
                        type="button"
                        onClick={() => {
                          approvePickupBoxFromUR(boxID);
                        }}
                      >
                        <img src={ApproveBoxIcon} alt="" />
                      </button>
                    </div>
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
export default PickupBox;
