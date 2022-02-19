import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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

import { FYABackend, formatDate } from '../../common/utils';
import { uploadBoxPhoto, validateZip } from './BoxFormUtils';
import DropZone from './DropZone/DropZone';
import 'react-datepicker/dist/react-datepicker.css';
import './BoxForm.css';
import './DatePicker.css';

yup.addMethod(yup.string, 'isZip', validateZip);
const schema = yup
  .object({
    boxNumber: yup.number().required().typeError('Invalid box number'),
    date: yup
      .date()
      .required('Invalid date, please enter a date')
      .typeError('Invalid date, please enter a date'),
    zipCode: yup.string().isZip().required('Invalid zipcode, please enter a valid zipcode'),
    boxLocation: yup.string(),
    message: yup.string(),
    comments: yup.string(),
    launchedOrganically: yup.bool().default(false),
    picture: yup.string().url(),
  })
  .required();

const BoxForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    delayError: 750,
  });

  const [files, setFiles] = useState([]);

  const onSubmit = async data => {
    const formData = data;
    formData.date = formatDate(data.date);
    formData.picture = files.length > 0 ? await uploadBoxPhoto(files[0]) : '';

    // send form data to server
    await FYABackend.post('/boxForm', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  return (
    <form className="box-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="box-info-section">
        <div className="box-info">
          <FormControl isInvalid={errors?.date}>
            <FormLabel htmlFor="date">Date *</FormLabel>
            <Controller
              control={control}
              name="date"
              // eslint-disable-next-line no-unused-vars
              render={({ field: { onChange, value, ref } }) => (
                <DatePicker
                  placeholderText="MM/DD/YYYY"
                  className={errors?.date ? 'date-picker date-picker-error' : 'date-picker'}
                  type="date"
                  selected={value}
                  onChange={onChange}
                />
              )}
            />
            <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors?.boxNumber}>
            <FormLabel htmlFor="boxNumber">Box Number *</FormLabel>
            <Input id="boxNumber" placeholder="12345" name="boxNumber" {...register('boxNumber')} />
            <FormErrorMessage>{errors.boxNumber?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors?.zipCode}>
            <FormLabel htmlFor="zipCode">Zip Code *</FormLabel>
            <Input id="zipCode" placeholder="e.g. 90210" name="zipCode" {...register('zipCode')} />
            <FormErrorMessage>{errors.zipCode?.message}</FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="location">Box Location</FormLabel>
            <Input
              id="location"
              placeholder="e.g. University Park Library"
              name="boxLocation"
              {...register('boxLocation')}
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
            {...register('message')}
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
            {...register('comments')}
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
              {...register('launchedOrganically')}
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
};

export default BoxForm;
