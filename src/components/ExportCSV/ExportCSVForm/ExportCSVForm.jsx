import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import './ExportCSVForm.css';

const schema = yup
  .object({
    sortBy: yup.string().required(),
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

  const onSubmit = data => {
    alert(JSON.stringify(data, null, 2));
    setFormValues(data);
  };

  return (
    <div className="csv-form-wrapper">
      <form id={formID} onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors?.temp}>
          <FormLabel htmlFor="temp">Temp Field</FormLabel>
          <Input id="temp" placeholder="Enter Text" {...register('temp')} />
          <p className="error-message">{errors.temp?.message}</p>
        </FormControl>

        <FormControl isInvalid={errors?.sortBy}>
          <FormLabel htmlFor="sort-by">Sort By</FormLabel>
          <Select id="sort-by" {...register('sortBy')}>
            <option value="ascend-box-num">Ascending Box Number</option>
            <option value="descend-box-num">Descending Box Number</option>
            <option value="chronologic">Chronologically</option>
            <option value="ascend-zip-code">Descending Zip Code</option>
            <option value="descend-zip-code">Descending Zip Code</option>
          </Select>
          <p className="error-message">{errors.sortBy?.message}</p>
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
