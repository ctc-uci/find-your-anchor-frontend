import React, { useState, useEffect } from 'react';
import {
  FormErrorMessage,
  Textarea,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Button,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import axios from 'axios';
import isValidZipcode from 'is-valid-zipcode';
import FYABackend from '../../common/utils';
import DropZone from './DropZone/DropZone';
import './BoxForm.css';

function Box() {
  const [submit, setSubmit] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    boxNumber: '',
    date: '',
    zipCode: '',
    boxLocation: '',
    message: '',
    picture: '',
    comments: '',
  });

  // states for tracking error inputs
  const [zipCodeError, setZipCodeError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [boxNumberError, setBoxNumberError] = useState(false);

  // useEffect ensures that the most recently updated formData is reflected
  useEffect(async () => {
    if (submit) {
      // send formdata to server
      const res = await FYABackend.post('/boxForm', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(res.data);
      setSubmit(false);
    }
  }, [submit]);

  const { boxNumber, date, zipCode, boxLocation, message, comments } = formData;

  const uploadBoxPhoto = async file => {
    // get S3 upload url from server
    const { data: uploadUrl } = await FYABackend.get('/s3Upload');

    // upload image directly to S3 bucket
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // return box image url
    const imageUrl = uploadUrl.split('?')[0];
    return imageUrl;
  };

  // const isError = key => {
  //   return formData[key] === '';
  // };

  const isValidZip = zip => {
    // return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zip);
    const countries = [
      'US',
      'AT',
      'BG',
      'BR',
      'CA',
      'CZ',
      'DK',
      'FR',
      'DE',
      'IN',
      'IT',
      'IE',
      'MA',
      'NL',
      'PL',
      'PT',
      'RO',
      'RU',
      'SG',
      'SK',
      'ES',
      'SE',
      'CH',
      'GB',
    ];
    return countries.filter(country => isValidZipcode(zip, country)).length > 0;
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async () => {
    if (files.length > 0) {
      const imageUrl = await uploadBoxPhoto(files[0]);
      setFormData({ ...formData, picture: imageUrl });
    }
    setSubmit(true);
  };

  const onSubmit = e => {
    e.preventDefault();
    setBoxNumberError(boxNumber === '' && true);
    setZipCodeError((zipCode === '' || !isValidZip(zipCode)) && true);
    setDateError(date === '' && true);
    if (!(boxNumberError || dateError || zipCodeError)) {
      submitForm();
    }
  };

  return (
    <form className="boxForm" onSubmit={e => onSubmit(e)}>
      <div className="a">
        <div className="boxInfo">
          <FormControl isInvalid={dateError}>
            <FormLabel htmlFor="date">Date</FormLabel>
            <Input type="date" id="date" name="date" value={date} onChange={e => onChange(e)} />
            {dateError && (
              <FormErrorMessage>Invalid month, please enter a valid month</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={boxNumberError}>
            <FormLabel htmlFor="boxNumber">Box Number</FormLabel>
            <Input
              id="boxNumber"
              placeholder="12345"
              name="boxNumber"
              value={boxNumber}
              onChange={e => onChange(e)}
            />
            {boxNumberError && <FormErrorMessage>Invalid box number</FormErrorMessage>}
          </FormControl>
          <FormControl isInvalid={zipCodeError}>
            <FormLabel htmlFor="zipCode">Zip Code</FormLabel>
            <Input
              id="zipCode"
              placeholder="ex. 90210"
              name="zipCode"
              value={zipCode}
              onChange={e => onChange(e)}
            />
            {zipCodeError && (
              <FormErrorMessage>Invalid zipcode, please enter a valid zipcode</FormErrorMessage>
            )}
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="location">Box Location</FormLabel>
            <Input
              id="location"
              placeholder="ex. 90210"
              name="boxLocation"
              value={boxLocation}
              onChange={e => onChange(e)}
            />
          </FormControl>
        </div>
      </div>
      <div className="b">
        <FormControl>
          <FormLabel htmlFor="message">Message:</FormLabel>
          <Textarea
            id="message"
            placeholder="200 characters max"
            maxLength="200"
            rows="6"
            name="message"
            value={message}
            onChange={e => onChange(e)}
          />
        </FormControl>
      </div>
      <div className="c">
        <FormControl>
          <FormLabel htmlFor="comments">Additional Comments (for admin purposes)</FormLabel>
          <Textarea
            id="message"
            placeholder="200 characters max"
            maxLength="200"
            rows="6"
            name="comments"
            value={comments}
            onChange={e => onChange(e)}
          />
        </FormControl>
      </div>
      <div className="d">
        <FormControl>
          <FormLabel htmlFor="boxPhoto">Attach Box Photo</FormLabel>
          <DropZone setFiles={setFiles} />
        </FormControl>
      </div>
      <div className="e">
        <div className="boxImage">
          {files.length !== 0 && <img src={URL.createObjectURL(files[0])} alt="" />}
        </div>
      </div>
      <div className="f">
        <div className="boxLaunched">
          <FormControl isRequired>
            <Checkbox className="checkbox" />
            <FormLabel htmlFor="isLaunched">Launched Organically?</FormLabel>
            <div className="infoIcon">
              <InfoIcon />
              <span className="tooltiptext">
                Organic launch means when the box is left somewhere for an individual to stumble
                upon it.
              </span>
            </div>
          </FormControl>
        </div>
        <div className="boxBottom">
          <div className="boxButtons">
            <Button size="md" className="cancelButton">
              Cancel
            </Button>
            <Button type="submit" size="md" colorScheme="teal">
              Add Box
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
export default Box;
