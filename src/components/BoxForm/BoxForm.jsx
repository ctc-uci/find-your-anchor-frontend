import React from 'react';
import { Checkbox, Button, Textarea, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import './BoxForm.css';
import DropZone from './DropZone/DropZone';

function Box() {
  const onSubmit = e => {
    console.log('submitted');
    e.preventDefault();
  };

  return (
    <form className="boxForm" onSubmit={e => onSubmit(e)}>
      <div className="boxInfo">
        <FormControl isRequired>
          <FormLabel htmlFor="date">Date</FormLabel>
          <Input type="date" id="date" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="boxNumber">Box Number</FormLabel>
          <Input id="boxNumber" placeholder="12345" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="zipCode">Zip Code</FormLabel>
          <Input id="zipCode" placeholder="12345" />
        </FormControl>
      </div>
      <div className="boxLocation">
        <FormControl isRequired>
          <FormLabel htmlFor="location">Box Location</FormLabel>
          <Input id="location" placeholder="Enter city, zipcode" />
        </FormControl>
      </div>
      <div className="boxDescription">
        <FormControl>
          <FormLabel htmlFor="message">Message:</FormLabel>
          <Textarea id="message" placeholder="200 characters max" maxLength="200" rows="5" />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="location">Attach Box Photo</FormLabel>
          <DropZone />
        </FormControl>
      </div>
      <div className="boxComments">
        <FormControl>
          <FormLabel htmlFor="comments">Additional Comments (for admin purposes)</FormLabel>
          <Textarea id="message" placeholder="200 characters max" maxLength="200" rows="5" />
        </FormControl>
      </div>
      <div className="boxLaunched">
        <FormControl isRequired>
          <Checkbox className="checkbox" />
          <FormLabel htmlFor="isLaunched">Launched Organically?</FormLabel>
          <div className="infoIcon">
            <InfoIcon />
            <span className="tooltiptext">
              Organic launch means when the box is left somewhere for an individual to stumble upon
            </span>
          </div>
        </FormControl>
      </div>
      <div className="boxBottom">
        <small>* represents required fields to fill out</small>
        <div className="boxButtons">
          <Button size="md" className="cancelButton">
            Cancel
          </Button>
          <Button type="submit" size="md" colorScheme="teal">
            Add Box
          </Button>
        </div>
      </div>
    </form>
  );
}
export default Box;
