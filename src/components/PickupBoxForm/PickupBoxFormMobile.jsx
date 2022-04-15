import React from 'react';
import DatePicker from 'react-datepicker';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PropTypes } from 'prop-types';
import { FormErrorMessage, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import { validateZip } from '../../common/FormUtils/boxFormUtils';
import DropZone from '../../common/FormUtils/DropZone/DropZone';
import 'react-datepicker/dist/react-datepicker.css';
import '../../common/FormUtils/DatePicker.css';
import styles from './PickupBoxForm.module.css';

yup.addMethod(yup.string, 'isZip', validateZip);
const schema = yup
  .object({
    boxholderName: yup.string().typeError('Invalid name'),
    boxID: yup
      .number()
      .required('Invalid box number, please enter a valid box number')
      .typeError('Invalid box number, please enter a valid box number'),
    date: yup
      .date()
      .required('Invalid date, please enter a valid date')
      .typeError('Invalid date, please enter a valid date'),
    boxholderEmail: yup
      .string()
      .required('Invalid email address, please enter a valid email address')
      .typeError('Invalid email address, please enter a valid email address'),
    zipcode: yup.string().isZip().required('Invalid zipcode, please enter a valid zipcode'),
    picture: yup.string().url(),
  })
  .required();

const PickupBoxFormMobile = ({ onSubmit, files, setFiles, loading }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    delayError: 750,
  });

  return (
    <form className={styles['pickup-box-form']} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles['pickup-box-info-section']}>
        <FormControl isInvalid={errors?.boxholderName}>
          <FormLabel htmlFor="boxholderName">Name</FormLabel>
          <Input
            id="boxholderName"
            placeholder="John Adams"
            name="boxholderName"
            {...register('boxholderName')}
          />
          <FormErrorMessage>{errors.boxholderName?.message}</FormErrorMessage>
        </FormControl>
        <br />
        <FormControl isInvalid={errors?.boxholderEmail}>
          <FormLabel htmlFor="boxholderEmail" className={styles['required-field']}>
            Email Address
          </FormLabel>
          <Input
            id="boxholderEmail"
            placeholder="name@domain.com"
            name="boxholderEmail"
            {...register('boxholderEmail')}
          />
          <FormErrorMessage>{errors.boxholderEmail?.message}</FormErrorMessage>
        </FormControl>
        <br />
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
        <FormControl isInvalid={errors?.boxID}>
          <FormLabel htmlFor="boxID" className={styles['required-field']}>
            Box Number
          </FormLabel>
          <Input id="boxID" placeholder="12345" name="boxID" {...register('boxID')} />
          <FormErrorMessage>{errors.boxID?.message}</FormErrorMessage>
        </FormControl>
        <br />
        <FormControl isInvalid={errors?.zipcode}>
          <FormLabel htmlFor="zipcode" className={styles['required-field']}>
            Zip Code
          </FormLabel>
          <Input id="zipCode" placeholder="e.g. 90210" name="zipcode" {...register('zipcode')} />
          <FormErrorMessage>{errors.zipcode?.message}</FormErrorMessage>
        </FormControl>
        <br />
      </div>
      <FormControl>
        <FormLabel className={styles['attach-box-photo-label']} htmlFor="boxPhoto">
          Attach Box Photo
        </FormLabel>
        <DropZone setFiles={setFiles} />
      </FormControl>
      <div
        className={
          styles[
            files.length !== 0
              ? 'pickup-box-photo-preview-section'
              : 'pickup-box-photo-preview-section-hidden'
          ]
        }
      >
        <div className={styles['box-image']}>
          {files.length !== 0 && <img src={URL.createObjectURL(files[0])} alt="" />}
        </div>
      </div>
      <br />
      <div className={styles['privacy-statement']}>
        <h3>
          * All personal information you provide on this form will be only used for internal
          purposes. They will not be shared publicly.
        </h3>
      </div>
      <br />
      <div className={styles['submit-button']}>
        <Button
          type="submit"
          size="md"
          colorScheme="teal"
          isLoading={loading}
          loadingText="Submitting"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

PickupBoxFormMobile.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  files: PropTypes.isRequired,
  setFiles: PropTypes.func.isRequired,
  loading: PropTypes.isRequired,
};

export default PickupBoxFormMobile;
