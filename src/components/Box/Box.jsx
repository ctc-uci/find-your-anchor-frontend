import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
  ChakraProvider,
  Icon,
  Textarea,
} from '@chakra-ui/react';
// import { Textarea } from "@chakra-ui/core";

import { MoonIcon, ArrowForwardIcon, CloseIcon, CheckIcon } from '@chakra-ui/icons';
import './Box.css';

function Box() {
  return (
    <ChakraProvider>
      <div className="box">
        <Accordion allowToggle>
          <AccordionItem>
            <h3>
              <AccordionButton>
                <Icon as={MoonIcon} />
                <div className="titleDiv">
                  <p className="title">
                    Box #1234
                    <br />
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
                <div className="subtitle">
                  <p>Name</p>
                </div>
                <Textarea resize="none" placeholder="Jane Doe" />
                <div className="subtitle">
                  <p>Email</p>
                </div>
                <Textarea resize="none" placeholder="jdoe12@gmail.com" />
                <div className="subtitle">
                  <p>Zip Code</p>
                </div>
                <Textarea resize="none" placeholder="91345" />
                <div className="iconRow">
                  <div className="closeIcon">
                    <CloseIcon w={6} h={6} />
                  </div>
                  <div className="arrowForwardIcon">
                    <ArrowForwardIcon w={6} h={6} />
                  </div>
                  <div className="checkIcon">
                    <CheckIcon w={6} h={6} />
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
export default Box;
