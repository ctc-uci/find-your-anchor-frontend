import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import countryList from 'react-select-country-list';
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
import { Select as ChakraReactSelect } from 'chakra-react-select';
import { FYABackend, formatDate, getLatLong } from '../../common/utils';
import { uploadBoxPhoto, validateZip } from '../../common/FormUtils/boxFormUtils';
import DropZone from '../../common/FormUtils/DropZone/DropZone';
import 'react-datepicker/dist/react-datepicker.css';
import '../../common/FormUtils/DatePicker.css';
import styles from './RelocateBoxForm.module.css';
import useMobileWidth from '../../common/useMobileWidth';

yup.addMethod(yup.object, 'isZipInCountry', validateZip);
const schema = yup
  .object({
    boxholderName: yup.string().typeError('Invalid name'),
    boxholderEmail: yup
      .string()
      .email('Invalid email address')
      .required('Invalid email address, please enter a valid email address')
      .typeError('Invalid email address, please enter a valid email address'),
    boxID: yup
      .number()
      .min(1, 'Invalid box number, please enter a valid box number')
      .required('Invalid box number, please enter a valid box number')
      .typeError('Invalid box number, please enter a valid box number'),
    date: yup
      .date()
      .required('Invalid date, please enter a valid date')
      .typeError('Invalid date, please enter a valid date'),
    zipcode: yup.string().required('Invalid zipcode, please enter a valid zipcode'),
    country: yup.object({
      label: yup.string().required('Invalid country, please select a country'),
      value: yup.string(),
    }),
    generalLocation: yup.string().typeError('Invalid location, please enter a valid location'),
    dropOffMethod: yup
      .string()
      .required('Invalid drop off method, please enter a valid drop off method'),
    message: yup.string().typeError('Invalid message, please enter a valid message'),
    picture: yup.string().url(),
  })
  .isZipInCountry()
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
  const [loading, setLoading] = useState(false);
  const countryOptions = useMemo(() => countryList().getData(), []);
  const isMobile = useMobileWidth();

  const onSubmit = async data => {
    const formData = data;
    formData.date = formatDate(data.date);
    formData.picture = files.length > 0 ? await uploadBoxPhoto(files[0]) : '';
    formData.country = formData.country.value;

    const [latitude, longitude] = await getLatLong(formData.zipcode, formData.country);
    if (latitude === undefined && longitude === undefined) {
      // TODO: display toast component
      alert(`Cannot find ${formData.zipcode} in country ${formData.country}`);
    } else {
      try {
        setLoading(true);
        await FYABackend.post('/boxHistory', {
          ...formData,
          launchedOrganically: formData.dropOffMethod === 'organic-launch',
          pickup: false,
          status: 'under review',
          messageStatus: 'pending',
          imageStatus: 'pending',
        });

        setFormSubmitted(true);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        // TODO: show error banner on failure
        console.log(err.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles['relocate-box-form']}>
        <div className={styles['relocate-box-info-section-left']}>
          <div>
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
            <FormControl isInvalid={errors?.boxID}>
              <FormLabel htmlFor="boxID" className={styles['required-field']}>
                Box Number
              </FormLabel>
              <Input id="boxID" placeholder="12345" name="boxID" {...register('boxID')} />
              <FormErrorMessage>{errors.boxNumber?.message}</FormErrorMessage>
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
            <FormControl
              isInvalid={errors?.zipcode || errors['']?.message.startsWith('Postal code')}
            >
              <FormLabel htmlFor="zipcode" className={styles['required-field']}>
                Zip Code
              </FormLabel>
              <Input
                id="zipcode"
                placeholder="e.g. 90210"
                name="zipcode"
                {...register('zipcode')}
              />
              {/* display an error if there is no zipcode */}
              <FormErrorMessage>{errors.zipcode?.message}</FormErrorMessage>
              {/* display an error if zipcode does not exist in country */}
              {errors['']?.message !== 'zip validated' && (
                <FormErrorMessage>{!errors.zipcode && errors['']?.message}</FormErrorMessage>
              )}
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
            <br />
            <FormControl isInvalid={errors?.country}>
              <FormLabel htmlFor="country" className={styles['required-field']}>
                Country
              </FormLabel>
              <Controller
                control={control}
                name="country"
                // eslint-disable-next-line no-unused-vars
                render={({ field: { onChange, value, ref } }) => (
                  <ChakraReactSelect options={countryOptions} value={value} onChange={onChange} />
                )}
              />
              <FormErrorMessage>{errors.country?.label.message}</FormErrorMessage>
            </FormControl>
          </div>
        </div>
        {isMobile && <br />}
        <div className={styles['relocate-box-info-section-right']}>
          <FormControl className={styles['section-wrapper']}>
            <FormLabel htmlFor="drop-off-method" className={styles['required-field']}>
              Launch Method
            </FormLabel>
            <Select id="drop-off-method" {...register('dropOffMethod')}>
              <option value="given-to-someone">Given to Someone</option>
              <option value="organic-launch">Dropped off at a location</option>
            </Select>
            <FormErrorMessage>{errors.dropOffMethod?.message}</FormErrorMessage>
          </FormControl>
          <br />
          {!isMobile && <br />}

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
            <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
          </FormControl>
          <br />
          {!isMobile && <br />}
          <FormControl>
            <FormLabel htmlFor="boxPhoto">Attach Box Photo</FormLabel>
            <DropZone setFiles={setFiles} />
          </FormControl>
          <br />
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
            <br />
          </div>
          <div className={styles['box-bottom']}>
            <Button
              type="submit"
              size="md"
              colorScheme="teal"
              isLoading={loading}
              loadingText="Submitting"
              className={styles['submit-button']}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
      <br />
      <h3 className={styles['privacy-statement']}>
        * All personal information you provide on this form will be only used for internal purposes.
        They will not be shared publicly.
      </h3>
    </form>
  );
};

RelocateBoxForm.propTypes = {
  setFormSubmitted: PropTypes.func.isRequired,
};

export default RelocateBoxForm;
