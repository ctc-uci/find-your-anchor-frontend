import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormErrorMessage, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import { formatDate } from '../../common/utils';
import { uploadBoxPhoto, validateZip } from '../../common/FormUtils/boxFormUtils';
import DropZone from '../../common/FormUtils/DropZone/DropZone';
import 'react-datepicker/dist/react-datepicker.css';
import '../AddBoxForm/DatePicker.css';
import './PickupBoxForm.css';

yup.addMethod(yup.string, 'isZip', validateZip);
const schema = yup
  .object({
    name: yup.string().typeError('Invalid name'),
    boxNumber: yup.number().required().typeError('Invalid box number'),
    date: yup
      .date()
      .required('Invalid date, please enter a valid date')
      .typeError('Invalid date, please enter a valid date'),
    email: yup.string().typeError('Invalid Email'),
    zipCode: yup.string().isZip().required('Invalid zipcode, please enter a valid zipcode'),
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

    // TODO: Add call to post data to backend
  };

  return (
    <form className="pickup-box-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="pickup-box-info-section">
        <div>
          <FormControl isInvalid={errors?.name}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              className="pickup-box-input"
              id="name"
              placeholder="John Adams"
              name="name"
              {...register('name')}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
          <br />
          <FormControl isInvalid={errors?.boxNumber}>
            <FormLabel htmlFor="boxNumber">Box Number *</FormLabel>
            <Input
              className="pickup-box-input"
              id="boxNumber"
              placeholder="12345"
              name="boxNumber"
              {...register('boxNumber')}
            />
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
            <Input
              className="pickup-box-input"
              id="zipCode"
              placeholder="e.g. 90210"
              name="zipCode"
              {...register('zipCode')}
            />
            <FormErrorMessage>{errors.zipCode?.message}</FormErrorMessage>
          </FormControl>
        </div>
      </div>
      <div>
        <FormControl isInvalid={errors?.email}>
          <FormLabel htmlFor="email">Email *</FormLabel>
          <Input
            className="pickup-box-input"
            id="email"
            placeholder="name@domain.com"
            name="email"
            {...register('email')}
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
        <br />
        <div>
          <FormControl>
            <FormLabel htmlFor="boxPhoto">Attach Box Photo</FormLabel>
            <DropZone setFiles={setFiles} />
          </FormControl>
          <br />
        </div>
        <div className="pickup-box-photo-preview-section">
          <div className="box-image">
            {files.length !== 0 && <img src={URL.createObjectURL(files[0])} alt="" />}
          </div>
        </div>
        <br />
        <div className="box-bottom">
          <div className="box-buttons">
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

export default BoxForm;
