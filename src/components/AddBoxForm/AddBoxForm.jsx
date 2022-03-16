import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  FormErrorMessage,
  Textarea,
  FormControl,
  FormLabel,
  Input,
  Button,
  RadioGroup,
  Radio,
  Stack,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

import { FYABackend, formatDate } from '../../common/utils';
import { uploadBoxPhoto, validateZip, validateBoxNumber } from './AddBoxFormUtils';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './AddBoxForm.module.css';
import AddBoxDropZone from './DropZone/AddBoxDropZone';

yup.addMethod(yup.string, 'isZip', validateZip);
yup.addMethod(yup.number, 'boxNotExists', validateBoxNumber);
const schema = yup
  .object({
    boxNumber: yup.number().boxNotExists().required().typeError('Invalid box number'),
    date: yup
      .date()
      .required('Invalid date, please enter a valid date')
      .typeError('Invalid date, please enter a valid date'),
    zipCode: yup.string().isZip().required('Invalid zipcode, please enter a valid zipcode'),
    boxLocation: yup.string(),
    message: yup.string(),
    comments: yup.string(),
    launchedOrganically: yup.string().typeError('Invalid selection'),
    picture: yup.string().url(),
  })
  .required();

const AddBoxForm = () => {
  const navigate = useNavigate();
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
    formData.launchedOrganically = formData.launchedOrganically === 'yes';
    formData.picture = files.length > 0 ? await uploadBoxPhoto(files[0]) : '';

    // send form data to server
    await FYABackend.post('/boxForm/box', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    navigate('/admin');
  };

  return (
    <form className={styles['add-box-form']} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles['add-box-info-section-left']}>
        <FormControl isInvalid={errors?.date}>
          <FormLabel htmlFor="date" className={styles['required-field']}>
            Date
          </FormLabel>
          <Controller
            control={control}
            name="date"
            // eslint-disable-next-line no-unused-vars
            render={({ field: { onChange, value, ref } }) => (
              <DatePicker
                placeholderText="MM/DD/YYYY"
                className={
                  errors?.date
                    ? `${styles['date-picker']} ${styles['date-picker-error']}`
                    : `${styles['date-picker']}`
                }
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
          <FormLabel htmlFor="zipCode" className={styles['required-field']}>
            Zip Code
          </FormLabel>
          <Input id="zipCode" placeholder="e.g. 90210" name="zipCode" {...register('zipCode')} />
          <FormErrorMessage>{errors.zipCode?.message}</FormErrorMessage>
        </FormControl>
        <br />
        <FormControl>
          <FormLabel htmlFor="message">Message:</FormLabel>
          <Textarea
            id="message"
            placeholder="200 characters max"
            maxLength="200"
            rows="5"
            name="message"
            className={styles['text-area']}
            {...register('message')}
          />
        </FormControl>
        <br />
        <FormControl>
          <FormLabel htmlFor="comments">Additional Comments (for admin purposes)</FormLabel>
          <Textarea
            id="message"
            placeholder="200 characters max"
            maxLength="200"
            rows="5"
            name="comments"
            className={styles['text-area']}
            {...register('comments')}
          />
        </FormControl>
        <br />
      </div>

      <div className={styles['add-box-info-section-right']}>
        <FormControl FormControl>
          <FormLabel htmlFor="location">Box Location</FormLabel>
          <Input
            id="location"
            placeholder="e.g. University Park Library"
            name="boxLocation"
            {...register('boxLocation')}
          />
        </FormControl>
        <br />
        <FormControl isInvalid={errors?.boxNumber}>
          <FormLabel htmlFor="boxNumber" className={styles['required-field']}>
            Box Number
          </FormLabel>
          <Input id="boxNumber" placeholder="12345" name="boxNumber" {...register('boxNumber')} />
          <FormErrorMessage>{errors.boxNumber?.message}</FormErrorMessage>
        </FormControl>
        <br />
        <FormControl isInvalid={errors?.launchedOrganically}>
          <div className={styles['box-launched-section']}>
            <FormLabel htmlFor="isLaunched" className={styles['required-field']}>
              Launched Organically?
            </FormLabel>
            <div className={styles['info-icon']}>
              <InfoIcon />
              <span className={styles['tool-tip-text']}>
                Organic launch means when the box is left somewhere for an individual to stumble
                upon it.
              </span>
            </div>
            <RadioGroup defaultValue="1" className={styles['launch-org-radio']}>
              <Stack spacing={8} direction="row">
                <Radio
                  name="launchedOrganically"
                  value="yes"
                  defaultChecked
                  {...register('launchedOrganically')}
                >
                  Yes
                </Radio>
                <Radio name="launchedOrganically" value="no" {...register('launchedOrganically')}>
                  No
                </Radio>
              </Stack>
            </RadioGroup>
          </div>
          <FormErrorMessage>{errors.launchedOrganically?.message}</FormErrorMessage>
        </FormControl>
        <br />
        <FormControl>
          <FormLabel htmlFor="boxPhoto">Attach Box Photo</FormLabel>
          <AddBoxDropZone setFiles={setFiles} />
        </FormControl>
        <div
          className={
            styles[
              files.length !== 0
                ? `${styles['add-box-photo-preview-section']}`
                : `${styles['add-box-photo-preview-section-hidden']}`
            ]
          }
        >
          <div className={styles['box-image']}>
            {files.length !== 0 && <img src={URL.createObjectURL(files[0])} alt="" />}
          </div>
        </div>
        <br />
        <div className={styles['submit-button']}>
          <Button type="submit" size="md" colorScheme="teal">
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddBoxForm;
