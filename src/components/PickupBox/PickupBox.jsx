import React from 'react';
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
  Box as ImageBox,
} from '@chakra-ui/react';

import './PickupBox.css';
import PropTypes from 'prop-types';
import ApproveBoxIcon from '../BoxIcons/ApproveBoxIcon.svg';
import RejectBoxIcon from '../BoxIcons/RejectBoxIcon.svg';
import PickupBoxIcon from '../BoxIcons/PickupBoxIcon.svg';
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
                <ImageBox
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  w="100%"
                  h="calc((100vw - 20px) * 0.12)"
                  p={24}
                  src={picture}
                />
                <FormControl>
                  <FormLabel htmlFor="name" marginTop="5%">
                    Name
                  </FormLabel>
                  <Input id="name" type="name" placeholder={name} />

                  <FormLabel htmlFor="email" marginTop="5%">
                    Email
                  </FormLabel>
                  <Input id="email" type="email" placeholder={email} />
                  <FormLabel htmlFor="zipCode" marginTop="5%">
                    Zip Code
                  </FormLabel>
                  <Input id="zipCode" type="zipCode" placeholder={currentLocation} />
                </FormControl>
                <div className="iconRow">
                  <div className="closeIcon">
                    <button type="button">
                      <img src={RejectBoxIcon} alt="" />
                    </button>
                  </div>
                  <div className="checkIcon">
                    <button type="button">
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
