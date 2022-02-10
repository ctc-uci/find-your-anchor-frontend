import { React, useEffect } from 'react';
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
import ApproveBoxIcon from '../BoxIcons/ApproveBoxIcon.svg';
import RejectBoxIcon from '../BoxIcons/RejectBoxIcon.svg';
import PickupBoxIcon from '../BoxIcons/PickupBoxIcon.svg';
import utils from '../../common/utils';
// import RequestChangesIcon from '../BoxIcons/RequestChangesIcon.svg';

function PickupBox(props) {
  const { boxID, name, email, currentLocation, picture } = props;
  PickupBox.propTypes = {
    boxID: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    currentLocation: PropTypes.number.isRequired,
    picture: PropTypes.string.isRequired,
  };

  const approvePickupBoxFromUR = response => {
    utils.put('/pickupBoxes/approved', {
      box_id: response,
    });
  };
  useEffect(() => approvePickupBoxFromUR(), []);

  const rejectPickupBoxFromUR = response => {
    utils.put('/pickupBoxes/rejected', {
      box_id: response,
    });
  };
  useEffect(() => rejectPickupBoxFromUR(), []);

  return (
    <ChakraProvider>
      <div className="box">
        <Accordion allowToggle>
          <AccordionItem>
            <h3>
              <AccordionButton>
                <img src={PickupBoxIcon} alt="" />
                <div className="titleDiv">
                  <p className="title">
                    <p className="boxNumber">Box #{boxID}</p>
                    01/20/22
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
                  <Input isReadOnly id="name" type="name" placeholder={name} />

                  <FormLabel isReadOnly htmlFor="email" marginTop="5%">
                    Email
                  </FormLabel>
                  <Input isReadOnly id="email" type="email" placeholder={email} />
                  <FormLabel htmlFor="zipCode" marginTop="5%">
                    Zip Code
                  </FormLabel>
                  <Input isReadOnly id="zipCode" type="zipCode" placeholder={currentLocation} />
                </FormControl>
                <div className="iconRow">
                  <div className="closeIcon">
                    <button
                      type="button"
                      onClick={() => {
                        rejectPickupBoxFromUR(boxID);
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
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </ChakraProvider>
  );
}
export default PickupBox;
