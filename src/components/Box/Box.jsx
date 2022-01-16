import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
  ChakraProvider,
  Icon,
  FormControl,
  FormLabel,
  Input,
  Box as ImageBox,
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
                </FormControl>
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
