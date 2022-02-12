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
import DatePicker from 'react-datepicker';
import { FYABackend, isValidZip } from '../../common/utils';
import DropZone from './DropZone/DropZone';
import 'react-datepicker/dist/react-datepicker.css';
import './BoxForm.css';
import './DatePicker.css';

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
    launchedOrganically: false,
  });

  const [zipCodeError, setZipCodeError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [boxNumberError, setBoxNumberError] = useState(false);

  // useEffect ensures that the most recently updated formData is reflected
  useEffect(async () => {
    if (submit) {
      // send formdata to server
      await FYABackend.post('/boxForm', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
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

  const checkZipValid = zip => {
    return isValidZip(zip);
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setDate = selectedDate => {
    setFormData({ ...formData, date: selectedDate });
  };

  const handleCheckBox = e => {
    setFormData({ ...formData, launchedOrganically: e.target.checked });
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

    const isBoxNumberValid = boxNumber === '';
    const isZipValid = zipCode === '' || !checkZipValid(zipCode);
    const isDateValid = date === '' || date === null;

    setBoxNumberError(isBoxNumberValid);
    setZipCodeError(isZipValid);
    setDateError(isDateValid);

    if (!(isBoxNumberValid || isZipValid || isDateValid)) {
      submitForm();
    }
  };

  return (
    <form className="box-form" onSubmit={e => onSubmit(e)}>
      <div className="box-info-section">
        <div className="box-info">
          <FormControl isInvalid={dateError}>
            <FormLabel htmlFor="date">Date *</FormLabel>
            <DatePicker
              placeholderText="MM/DD/YYYY"
              className={dateError ? 'date-picker date-picker-error' : 'date-picker'}
              type="date"
              selected={date}
              name="date"
              onChange={selectedDate => setDate(selectedDate)}
            />
            {dateError && <FormErrorMessage>Invalid date, please enter a date</FormErrorMessage>}
          </FormControl>
          <FormControl isInvalid={boxNumberError}>
            <FormLabel htmlFor="boxNumber">Box Number *</FormLabel>
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
            <FormLabel htmlFor="zipCode">Zip Code *</FormLabel>
            <Input
              id="zipCode"
              placeholder="e.g. 90210"
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
              placeholder="e.g. University Park Library"
              name="boxLocation"
              value={boxLocation}
              onChange={e => onChange(e)}
            />
          </FormControl>
        </div>
      </div>
      <div className="box-message-section">
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
      <div className="box-comments-section">
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
      <div className="box-photo-section">
        <FormControl>
          <FormLabel htmlFor="boxPhoto">Attach Box Photo</FormLabel>
          <DropZone setFiles={setFiles} />
        </FormControl>
      </div>
      <div className="box-photo-preview-section">
        <div className="box-image">
          {files.length !== 0 && <img src={URL.createObjectURL(files[0])} alt="" />}
        </div>
      </div>
      <div className="box-launched-section">
        <div className="box-launched">
          <FormControl>
            <Checkbox
              className="checkbox"
              name="launchedOrganically"
              onChange={e => handleCheckBox(e)}
            />
            <FormLabel htmlFor="isLaunched">Launched Organically?</FormLabel>
            <div className="info-icon">
              <InfoIcon />
              <span className="tooltiptext">
                Organic launch means when the box is left somewhere for an individual to stumble
                upon it.
              </span>
            </div>
          </FormControl>
        </div>
        <div className="box-bottom">
          <div className="box-buttons">
            <Button size="md" className="cancel-button">
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
