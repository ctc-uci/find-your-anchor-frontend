import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  Radio,
  Checkbox,
  Button,
} from '@chakra-ui/react';
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
        {/* <FormControl isInvalid={errors?.temp}>
          <FormLabel htmlFor="temp">Temp Field</FormLabel>
          <Input id="temp" placeholder="Enter Text" {...register('temp')} />
          <p className="error-message">{errors.temp?.message}</p>
        </FormControl> */}

        <FormControl className="section-wrapper" isInvalid={errors?.sortBy}>
          <FormLabel htmlFor="sort-by" className="csv-form-labels">
            Sort By
          </FormLabel>
          <Select id="sort-by" {...register('sortBy')}>
            <option value="ascend-box-num">Ascending Box Number</option>
            <option value="descend-box-num">Descending Box Number</option>
            <option value="chronologic">Chronologically</option>
            <option value="ascend-zip-code">Descending Zip Code</option>
            <option value="descend-zip-code">Descending Zip Code</option>
          </Select>
          <p className="error-message">{errors.sortBy?.message}</p>
        </FormControl>

        <div className="filter-section-wrapper">
          <div className="filter-option-wrapper">
            <Text className="csv-form-labels">Filter Options</Text>
            <div className="filter-choices">
              <FormControl
                className="section-wrapper filter-label-select"
                isInvalid={errors?.sortBy}
              >
                <FormLabel htmlFor="boxes">Boxes</FormLabel>
                <Select id="boxes" className="select-filter-options" {...register('sortBy')}>
                  <option value="ascend-box-num">All</option>
                  <option value="descend-box-num">Custom</option>
                </Select>
              </FormControl>
              <p className="error-message">{errors.sortBy?.message}</p>
            </div>
            <div className="filter-choices">
              <FormControl
                className="section-wrapper filter-label-select"
                isInvalid={errors?.sortBy}
              >
                <FormLabel htmlFor="date">Date</FormLabel>
                <Select id="date" className="select-filter-options" {...register('sortBy')}>
                  <option value="ascend-box-num">All</option>
                  <option value="descend-box-num">Single Day</option>
                  <option value="descend-box-num">Range</option>
                </Select>
              </FormControl>
              <p className="error-message">{errors.sortBy?.message}</p>
            </div>
            <div className="filter-choices">
              <FormControl
                className="section-wrapper filter-label-select"
                isInvalid={errors?.sortBy}
              >
                <FormLabel htmlFor="zip">Zip Code</FormLabel>
                <Select id="zip" className="select-filter-options" {...register('sortBy')}>
                  <option value="ascend-box-num">All</option>
                  <option value="descend-box-num">Custom</option>
                </Select>
              </FormControl>
              <p className="error-message">{errors.sortBy?.message}</p>
            </div>
            <div className="filter-choices">
              <FormControl
                className="section-wrapper filter-label-select"
                isInvalid={errors?.sortBy}
              >
                <Text>Launch Organically?</Text>
                <Radio>Yes</Radio>
                <Radio>No</Radio>
              </FormControl>
              <p className="error-message">{errors.sortBy?.message}</p>
            </div>
          </div>
          <FormControl className="section-wrapper" isInvalid={errors?.sortBy}>
            <div className="box-detail-header">
              <Text className="csv-form-labels">Box Details</Text>
              <Button variant="link">Unselect All</Button>
            </div>
            <div className="box-detail-checkboxes">
              <Checkbox>Date</Checkbox>
              <Checkbox>Box Number</Checkbox>
              <Checkbox>Zip Code</Checkbox>
              <Checkbox>Image</Checkbox>
              <Checkbox>Landmarks</Checkbox>
              <Checkbox>Launch Type</Checkbox>
              <Checkbox>Messages</Checkbox>
            </div>
          </FormControl>
        </div>
      </form>
    </div>
  );
};

ExportCSVForm.propTypes = {
  formID: PropTypes.string.isRequired,
  setFormValues: PropTypes.func.isRequired,
};

export default ExportCSVForm;
