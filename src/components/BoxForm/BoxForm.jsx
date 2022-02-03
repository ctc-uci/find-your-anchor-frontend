/* eslint-disable */
import React, { useState } from 'react';
import { Checkbox, Button, Textarea, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import './BoxForm.css';
import DropZone from './DropZone/DropZone';

function Box() {
  const [formData, setFormData] = useState({
    boxNumber: '',
    date: '',
    zipCode: '',
    boxLocation: '',
    message: '',
    // boxPhotoUrl: '',
    comments: '',
  });

  const { boxNumber, date, zipCode, boxLocation, message, comments } = formData;

  const onChange = e => {
    setFormData({ [e.target.name]: e.target.value });  // eslint-disable-line
  };

  const onSubmit = e => {
    // console.log('submitted');
    // console.log(formData);
    e.preventDefault(); 
  };

  // const isError = input === '';
  const isError = key => {
    return formData[key] === '';
  };

  return (
    <form className="boxForm" onSubmit={e => onSubmit(e)}>
      <div className="boxInfo">
        <FormControl isRequired isInvalid={isError('date')}>
          <FormLabel htmlFor="date">Date</FormLabel>
          <Input
            // errorBorderColor="red.300"
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={e => onChange(e)}
          />
        </FormControl>
        <FormControl isRequired isInvalid={isError('boxNumber')}>
          <FormLabel htmlFor="boxNumber">Box Number</FormLabel>
          <Input
            id="boxNumber"
            placeholder="12345"
            name="boxNumber"
            value={boxNumber}
            onChange={e => onChange(e)}
          />
        </FormControl>
        <FormControl isRequired isInvalid={isError('zipCode')}>
          <FormLabel htmlFor="zipCode">Zip Code</FormLabel>
          <Input
            id="zipCode"
            placeholder="12345"
            name="zipCode"
            value={zipCode}
            onChange={e => onChange(e)}
          />
        </FormControl>
      </div>
      <div className="boxLocation">
        <FormControl>
          <FormLabel htmlFor="location">Box Location</FormLabel>
          <Input
            id="location"
            placeholder="Enter city, zipcode"
            name="boxLocation"
            value={boxLocation}
            onChange={e => onChange(e)}
          />
        </FormControl>
      </div>
      <div className="boxDescription">
        <FormControl>
          <FormLabel htmlFor="message">Message:</FormLabel>
          <Textarea
            id="message"
            placeholder="200 characters max"
            maxLength="200"
            rows="5"
            name="message"
            value={message}
            onChange={e => onChange(e)}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="location">Attach Box Photo</FormLabel>
          <DropZone />
        </FormControl>
      </div>
      <div className="boxComments">
        <FormControl>
          <FormLabel htmlFor="comments">Additional Comments (for admin purposes)</FormLabel>
          <Textarea
            id="message"
            placeholder="200 characters max"
            maxLength="200"
            rows="5"
            name="comments"
            value={comments}
            onChange={e => onChange(e)}
          />
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
