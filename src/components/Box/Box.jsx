import React from 'react';
import { Button } from '@chakra-ui/react';
import { CloseIcon, CheckIcon } from '@chakra-ui/icons';
import './Box.css';

function Box() {
  return (
    <div className="box">
      <div className="boxHeader">
        <div className="boxHeaderInfo">
          <h3>Box #</h3>
          <p>date</p>
        </div>
        <div className="boxHeaderButtons">
          <Button size="xs" className="reviewButton">
            <CloseIcon />
          </Button>
          <Button size="xs" className="reviewButton">
            <CheckIcon />
          </Button>
        </div>
      </div>
      <div className="boxDetails">
        <p>ID</p>
        <p>Date</p>
        <p>Zip Code</p>
        <p>Description/Notes</p>
      </div>
    </div>
  );
}
export default Box;
