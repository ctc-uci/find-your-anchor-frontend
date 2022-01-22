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
import ApproveBoxIcon from '../BoxIcons/ApproveBoxIcon.svg';
import RejectBoxIcon from '../BoxIcons/RejectBoxIcon.svg';
import RelocateBoxIcon from '../BoxIcons/RelocateBoxIcon.svg';
import RequestChangesIcon from '../BoxIcons/RequestChangesIcon.svg';

function RelocationBox() {
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
                    <p className="boxNumber">Box #1234</p>
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
                >
                  This is the Box
                </ImageBox>
                <FormControl>
                  <FormLabel htmlFor="name" placeholder="Jane Doe" marginTop="5%">
                    Name
                  </FormLabel>
                  <Input id="name" type="name" />
                  <FormLabel htmlFor="email" placeholder="jdoe12@gmail.com" marginTop="5%">
                    Email
                  </FormLabel>
                  <Input id="email" type="email" />
                  <FormLabel htmlFor="zipCode" placeholder="91345" marginTop="5%">
                    Zip Code
                  </FormLabel>
                  <Input id="zipCode" type="zipCode" />
                  <FormLabel
                    htmlFor="generalLocation"
                    placeholder="Santa Monica Pier"
                    marginTop="5%"
                  >
                    General Location
                  </FormLabel>
                  <Input id="generalLocation" type="generalLocation" />
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
                <Textarea placeholder="Hello" size="sm" resize="vertical" />
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
