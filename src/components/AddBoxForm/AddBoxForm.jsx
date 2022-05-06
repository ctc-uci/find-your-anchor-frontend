import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Button,
  RadioGroup,
  Radio,
  Stack,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { Select } from 'chakra-react-select';
import countryList from 'react-select-country-list';

import {
  validateZip,
  validateBoxNumber,
  uploadBoxPhoto,
} from '../../common/FormUtils/boxFormUtils';
import { FYABackend, formatDate, getLatLong } from '../../common/utils';

import 'react-datepicker/dist/react-datepicker.css';
import styles from './AddBoxForm.module.css';
import DropZone from '../../common/FormUtils/DropZone/DropZone';
import useMobileWidth from '../../common/useMobileWidth';
import { useCustomToast } from '../ToastProvider/ToastProvider';

yup.addMethod(yup.object, 'isZipInCountry', validateZip);
yup.addMethod(yup.number, 'boxNotExists', validateBoxNumber);
const schema = yup
  .object({
    boxNumber: yup
      .number()
      .boxNotExists()
      .min(1, 'Invalid box number, please enter a valid box number')
      .required()
      .typeError('Invalid box number'),
    date: yup
      .date()
      .required('Invalid date, please enter a valid date')
      .typeError('Invalid date, please enter a valid date'),
    zipcode: yup.string().required('Invalid zipcode, please enter a valid zipcode'),
    country: yup.object({
      label: yup.string().required('Invalid country, please select a country'),
      value: yup.string(),
    }),
    boxLocation: yup.string(),
    message: yup.string(),
    comments: yup.string(),
    launchedOrganically: yup.string().typeError('Invalid selection'),
    picture: yup.string().url(),
  })
  .isZipInCountry()
  .required();

const AddBoxForm = () => {
  const isMobile = useMobileWidth();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useCustomToast();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    delayError: 750,
  });

  const countryOptions = useMemo(() => countryList().getData(), []);

  const onSubmit = async data => {
    const formData = data;
    formData.date = formatDate(data.date);
    formData.launchedOrganically = formData.launchedOrganically === 'yes';
    formData.picture = files.length > 0 ? await uploadBoxPhoto(files[0]) : '';
    formData.country = formData.country.value;

    const [latitude, longitude] = await getLatLong(formData.zipcode, formData.country);
    if (latitude === undefined && longitude === undefined) {
      showToast({
        title: 'Form Error',
        message: `Cannot find ${formData.zipcode} in country ${formData.country}`,
        toastPosition: 'bottom-right',
        type: 'error',
      });
    } else {
      try {
        setLoading(true);
        /* eslint-disable object-shorthand */
        await FYABackend.post('/anchorBox/box', {
          ...formData,
          latitude: latitude,
          longitude: longitude,
          showOnMap: true,
        });
        setLoading(false);
        navigate('/');
        showToast({
          title: 'Box Added Sucessfully',
          message: `Sucessfully added to Box #${formData.boxNumber} to map`,
          toastPosition: 'bottom-right',
          type: 'success',
        });
      } catch (err) {
        setLoading(false);
        showToast({
          title: 'Form Error',
          message: err.message,
          toastPosition: 'bottom-right',
          type: 'error',
        });
      }
    }
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
        {isMobile && (
          <>
            <FormControl isInvalid={errors?.boxNumber}>
              <FormLabel htmlFor="boxNumber" className={styles['required-field']}>
                Box Number
              </FormLabel>
              <Input
                id="boxNumber"
                placeholder="12345"
                name="boxNumber"
                {...register('boxNumber')}
              />
              <FormErrorMessage>{errors.boxNumber?.message}</FormErrorMessage>
            </FormControl>
            <br />
          </>
        )}
        <FormControl isInvalid={errors?.zipcode || errors['']?.message.startsWith('Postal code')}>
          <FormLabel htmlFor="zipcode" className={styles['required-field']}>
            Zip Code
          </FormLabel>
          <Input id="zipcode" placeholder="e.g. 90210" name="zipcode" {...register('zipcode')} />
          {/* display an error if there is no zipcode */}
          <FormErrorMessage>{errors.zipcode?.message}</FormErrorMessage>
          {/* display an error if zipcode does not exist in country */}
          {errors['']?.message !== 'zip validated' && (
            <FormErrorMessage>{!errors.zipcode && errors['']?.message}</FormErrorMessage>
          )}
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
              <Select options={countryOptions} value={value} onChange={onChange} />
            )}
          />
          <FormErrorMessage>{errors.country?.label.message}</FormErrorMessage>
        </FormControl>
        <br />
        {isMobile && (
          <>
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
          </>
        )}
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
          <FormLabel htmlFor="comments">Additional Comments</FormLabel>
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
        {!isMobile && (
          <>
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
          </>
        )}
        {!isMobile && (
          <>
            <FormControl isInvalid={errors?.boxNumber}>
              <FormLabel htmlFor="boxNumber" className={styles['required-field']}>
                Box Number
              </FormLabel>
              <Input
                id="boxNumber"
                placeholder="12345"
                name="boxNumber"
                {...register('boxNumber')}
              />
              <FormErrorMessage>{errors.boxNumber?.message}</FormErrorMessage>
            </FormControl>
            <br />
          </>
        )}
        <FormControl isInvalid={errors?.launchedOrganically}>
          <div className={styles['box-launched-section']}>
            <div className={styles['box-launch-label']}>
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
            </div>
            <div className={styles['launch-radio']}>
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
          </div>
          <FormErrorMessage>{errors.launchedOrganically?.message}</FormErrorMessage>
        </FormControl>
        <br />
        <FormControl>
          <FormLabel htmlFor="boxPhoto">Attach Box Photo</FormLabel>
          <DropZone setFiles={setFiles} />
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
      </div>
    </form>
  );
};

export default AddBoxForm;
