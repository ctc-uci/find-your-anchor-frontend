import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PropTypes } from 'prop-types';
import {
  FormErrorMessage,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  Select,
} from '@chakra-ui/react';
import { formatDate } from '../../common/utils';
import { uploadBoxPhoto, validateZip } from '../../common/FormUtils/boxFormUtils';
import DropZone from '../../common/FormUtils/DropZone/DropZone';
import 'react-datepicker/dist/react-datepicker.css';
import '../../common/FormUtils/DatePicker.css';
import styles from './RelocateBoxForm.module.css';

yup.addMethod(yup.string, 'isZip', validateZip);
const schema = yup
  .object({
    name: yup.string().typeError('Invalid name'),
    email: yup
      .string()
      .email('Invalid email address')
      .required('Invalid email address, please enter a valid email address')
      .typeError('Invalid email address, please enter a valid email address'),
    boxNumber: yup
      .number()
      .min(1, 'Invalid box number, please enter a valid box number')
      .required('Invalid box number, please enter a valid box number')
      .typeError('Invalid box number, please enter a valid box number'),
    date: yup
      .date()
      .required('Invalid date, please enter a valid date')
      .typeError('Invalid date, please enter a valid date'),
    zipCode: yup.string().isZip().required('Invalid zipcode, please enter a valid zipcode'),
    generalLocation: yup.string().typeError('Invalid location, please enter a valid location'),
    dropOffMethod: yup
      .string()
      .required('Invalid drop off method, please enter a valid drop off method'),
    message: yup.string().typeError('Invalid message, please enter a valid message'),
    picture: yup.string().url(),
  })
  .required();

const RelocateBoxForm = ({ setFormSubmitted }) => {
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
    setFormSubmitted(true);
    const formData = data;
    formData.date = formatDate(data.date);
    formData.picture = files.length > 0 ? await uploadBoxPhoto(files[0]) : '';

    // TODO: Add call to post data to backend
    console.table(formData);
  };

  return (
    <form className={styles['relocate-box-form']} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles['relocate-box-info-section-left']}>
        <div>
          <FormControl isInvalid={errors?.name}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input id="name" placeholder="John Adams" name="name" {...register('name')} />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
          <br />
          <FormControl isInvalid={errors?.email}>
            <FormLabel htmlFor="email">Email Address *</FormLabel>
            <Input id="email" placeholder="name@domain.com" name="email" {...register('email')} />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>
          <br />
          <FormControl isInvalid={errors?.boxNumber}>
            <FormLabel htmlFor="boxNumber">Box Number *</FormLabel>
            <Input id="boxNumber" placeholder="12345" name="boxNumber" {...register('boxNumber')} />
            <FormErrorMessage>{errors.boxNumber?.message}</FormErrorMessage>
          </FormControl>
          <br />
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
          <br />
          <FormControl isInvalid={errors?.zipCode}>
            <FormLabel htmlFor="zipCode">Zip Code *</FormLabel>
            <Input id="zipCode" placeholder="e.g. 90210" name="zipCode" {...register('zipCode')} />
            <FormErrorMessage>{errors.zipCode?.message}</FormErrorMessage>
          </FormControl>
          <br />
          <FormControl isInvalid={errors?.generalLocation}>
            <FormLabel htmlFor="generalLocation">General Location</FormLabel>
            <Input
              id="generalLocation"
              placeholder="ex. Santa Monica Pier"
              name="generalLocation"
              {...register('generalLocation')}
            />
            <FormErrorMessage>{errors.generalLocation?.message}</FormErrorMessage>
          </FormControl>
        </div>
      </div>

      <div className={styles['relocate-box-info-section-right']}>
        <FormControl className={styles['section-wrapper']}>
          <FormLabel htmlFor="drop-off-method" className={styles['csv-form-labels']}>
            Drop Off Method *
          </FormLabel>
          <Select id="drop-off-method" {...register('dropOffMethod')}>
            <option value="given-to-someone">Given to Someone</option>
            <option value="drop-off-location">Dropped off at a location</option>
          </Select>
          <FormErrorMessage>{errors.dropOffMethod?.message}</FormErrorMessage>
        </FormControl>
        <br />

        <FormControl isInvalid={errors?.message}>
          <FormLabel htmlFor="message">Message</FormLabel>
          <Textarea
            id="message"
            resize="vertical"
            maxLength="200"
            placeholder="200 characters max"
            name="message"
            {...register('message')}
          />
          <FormErrorMessage>{errors.message?.message}</FormErrorMessage>
        </FormControl>
        <br />

        <div>
          <FormControl>
            <FormLabel htmlFor="boxPhoto">Attach Box Photo</FormLabel>
            <DropZone setFiles={setFiles} />
          </FormControl>
          <br />
        </div>
        <div
          className={
            styles[
              files.length !== 0
                ? 'relocate-box-photo-preview-section'
                : 'relocate-box-photo-preview-section-hidden'
            ]
          }
        >
          <div className={styles['box-image']}>
            {files.length !== 0 && <img src={URL.createObjectURL(files[0])} alt="" />}
          </div>
        </div>
        <br />
        <div className={styles['box-bottom']}>
          <div className={styles['box-buttons']}>
            <Button size="md" className="cancel-button">
              Cancel
            </Button>
            <Button type="submit" size="md" colorScheme="teal">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

RelocateBoxForm.propTypes = {
  setFormSubmitted: PropTypes.func.isRequired,
};

export default RelocateBoxForm;
