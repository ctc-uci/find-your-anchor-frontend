import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import './ExportCSVForm.css';

const schema = yup
  .object({
    temp: yup.mixed().required(),
  })
  .required();

const ExportCSVForm = ({ formID, setFormValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    delayError: 750,
  });

  const onSubmit = () => {
    console.log('form submitted');
    setFormValues([]);
  };

  return (
    <div className="csv-form-wrapper">
      <form id={formID} onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors?.temp}>
          <FormLabel htmlFor="temp">Temp Field</FormLabel>
          <Input id="temp" placeholder="Enter Text" {...register('temp')} />
          <p className="error-message">{errors.temp?.message}</p>
        </FormControl>
      </form>
    </div>
  );
};

ExportCSVForm.propTypes = {
  formID: PropTypes.string.isRequired,
  setFormValues: PropTypes.func.isRequired,
};

export default ExportCSVForm;
