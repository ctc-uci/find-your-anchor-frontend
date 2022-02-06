import React, { useState } from 'react';
import { Checkbox, Button, Textarea, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import './BoxForm.css';
import axios from 'axios';
import FYABackend from '../../common/utils';
import DropZone from './DropZone/DropZone';

function Box() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    boxNumber: '',
    date: '',
    zipCode: '',
    boxLocation: '',
    message: '',
    boxPhotoUrl: '',
    comments: '',
  });

  const { boxNumber, date, zipCode, boxLocation, message, comments } = formData;

  // uploads box photo onto AWS S3 and returns url
  const uploadBoxPhoto = async file => {
    // get S3 upload url from server
    const { data: uploadUrl } = await FYABackend.get('/s3Upload');

    // upload image directly to S3 bucket
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // get box photo image url
    const imageUrl = uploadUrl.split('?')[0];
    return imageUrl;
  };

  const isError = key => {
    return formData[key] === '';
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (files.length > 0) {
      const imageUrl = await uploadBoxPhoto(files[0]);
      console.log('IMAGE URL:', imageUrl);
      setFormData({ ...formData, boxPhotoUrl: imageUrl });
      console.log('FORMDATA', formData);
    }

    // send formdata to server
    const res = await FYABackend.post('/boxForm', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(res.data);
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
          <FormLabel htmlFor="boxPhoto">Attach Box Photo</FormLabel>
          <DropZone setFiles={setFiles} />
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
