import React from 'react';
import { Button, Icon, Textarea } from '@chakra-ui/react';
// import { Textarea } from "@chakra-ui/core";
import { ChevronDownIcon, MoonIcon } from '@chakra-ui/icons';
import './Box.css';

function Box() {
  return (
    <div className="box">
      <div className="boxHeader">
        <Icon as={MoonIcon} />
        <div className="boxHeaderInfo">
          <h3>Box #1234</h3>
          <p>01/20/22</p>
        </div>
        <div className="toggleCollapseButton">
          <Button size="lg" className="collapseButton">
            <ChevronDownIcon />
          </Button>
        </div>
        {/* <div className="boxHeaderButtons">
          <Button size="xs" className="reviewButton">
            <CloseIcon />
          </Button>
          <Button size="xs" className="reviewButton">
            <CheckIcon />
          </Button>
        </div> */}
      </div>
      <div className="boxDetails">
        <p>Name</p>
        <Textarea placeholder="Jane Doe" />
        <p>Email</p>
        <Textarea placeholder="jdoe12@gmail.com" />
        <p>Zip Code</p>
        <Textarea placeholder="91345" />
      </div>
    </div>
  );
}
export default Box;
