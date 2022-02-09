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
  Select,
  Textarea,
  Box as ImageBox,
} from '@chakra-ui/react';

import './RelocationBox.css';
import PropTypes from 'prop-types';
import ApproveBoxIcon from '../BoxIcons/ApproveBoxIcon.svg';
import RejectBoxIcon from '../BoxIcons/RejectBoxIcon.svg';
import RelocateBoxIcon from '../BoxIcons/RelocateBoxIcon.svg';
import RequestChangesIcon from '../BoxIcons/RequestChangesIcon.svg';

function RelocationBox(props) {
  const { boxID, name, email, currentLocation, picture, generalLocation, message } = props;
  RelocationBox.propTypes = {
    boxID: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    currentLocation: PropTypes.number.isRequired,
    picture: PropTypes.string.isRequired,
    generalLocation: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  };
  return (
    <ChakraProvider>
      <div className="box">
        <Accordion allowToggle>
          <AccordionItem>
            <h3>
              <AccordionButton>
                <img src={RelocateBoxIcon} alt="" />
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
                  bg="white"
                  w="100%"
                  h="calc((100vw - 20px) * 0.12)"
                  p={24}
                  color="white"
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
                  <FormLabel htmlFor="generalLocation" marginTop="5%">
                    General Location
                  </FormLabel>
                  <Input
                    id="generalLocation"
                    type="generalLocation"
                    placeholder={generalLocation}
                  />
                  <FormLabel htmlFor="dropOffMethod" marginTop="5%">
                    Drop Off Method
                  </FormLabel>
                  <Select id="generalLocation" placeholder="Select Method">
                    <option>Given to Someone</option>
                    <option>Left at Location</option>
                  </Select>
                  <FormLabel htmlFor="Message" marginTop="5%">
                    Message
                  </FormLabel>
                </FormControl>
                <Textarea placeholder={message} size="sm" resize="vertical" />
                <div className="iconRow">
                  <div className="closeIcon">
                    <button type="button">
                      <img src={RejectBoxIcon} alt="" />
                    </button>
                  </div>
                  <div className="arrowForwardIcon">
                    <button type="button">
                      <img src={RequestChangesIcon} alt="" />
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
export default RelocationBox;
