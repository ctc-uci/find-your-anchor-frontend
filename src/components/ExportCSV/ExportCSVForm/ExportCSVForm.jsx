import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker from 'react-datepicker';
import * as yup from 'yup';

import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Button,
} from '@chakra-ui/react';
import './ExportCSVForm.css';
import { isValidRange, isZip } from './ExportCSVFormValidators';

yup.addMethod(yup.mixed, 'isZip', isZip);
yup.addMethod(yup.mixed, 'isValidRange', isValidRange);
const schema = yup
  .object({
    zipCode: yup.mixed().isZip(),
    boxRange: yup.mixed().isValidRange(),
  })
  .required();

const ExportCSVForm = ({ formID, setFormValues }) => {
  const {
    control,
    reset,
    getValues,
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sortBy: 'ascend-box-num',
      boxOption: 'boxes-all',
      boxRange: '0',
      dateOption: 'date-all',
      singleDate: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      zipOption: 'zip-code-all',
      zipCode: '92617',
      launchOrg: 'yes',
      boxDetails: [],
    },
    resolver: yupResolver(schema),
    delayError: 750,
  });

  const onSubmit = data => {
    setFormValues(data);
  };

  const [boxOption, dateOption, startDate, endDate, zipOption] = watch([
    'boxOption',
    'dateOption',
    'startDate',
    'endDate',
    'zipOption',
  ]);

  return (
    <div className="csv-form-wrapper">
      <form id={formID} onSubmit={handleSubmit(onSubmit)}>
        <FormControl className="section-wrapper">
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
                <div className="input-drop-down">
                  <Select id="boxes" className="select-filter-options" {...register('boxOption')}>
                    <option value="boxes-all">All</option>
                    <option value="boxes-custom">Custom</option>
                  </Select>
                  <Input
                    isInvalid={errors?.boxRange}
                    placeholder="e.g. 1-9, 6, 12"
                    {...register('boxRange')}
                    className={`custom-input ${boxOption === 'boxes-custom' ? 'active' : ''}`}
                  />
                </div>
              </FormControl>
            </div>
            <div className="filter-choices">
              <FormControl
                className="section-wrapper filter-label-select"
                isInvalid={errors?.sortBy}
              >
                <FormLabel htmlFor="date">Date</FormLabel>
                <div className="input-drop-down">
                  <Select id="date" className="select-filter-options" {...register('dateOption')}>
                    <option value="date-all">All</option>
                    <option value="date-single">Single Day</option>
                    <option value="date-range">Range</option>
                  </Select>
                  {dateOption === 'date-single' && (
                    <Controller
                      name="singleDate"
                      control={control}
                      // eslint-disable-next-line no-unused-vars
                      render={({ field: { onChange, value, ref } }) => (
                        <DatePicker
                          className="date-picker"
                          placeholderText="MM/DD/YYYY"
                          type="date"
                          selected={value}
                          onChange={onChange}
                        />
                      )}
                    />
                  )}
                  {dateOption === 'date-range' && (
                    <div className="date-range">
                      <FormControl>
                        <FormLabel className="date-range-label" htmlFor="start-date">
                          Start Date
                        </FormLabel>
                        <Controller
                          name="startDate"
                          control={control}
                          // eslint-disable-next-line no-unused-vars
                          render={({ field: { onChange, value, ref } }) => (
                            <DatePicker
                              className="date-picker"
                              placeholderText="MM/DD/YYYY"
                              type="date"
                              selected={value}
                              onChange={onChange}
                              selectsStart
                              startDate={startDate}
                              endDate={endDate}
                            />
                          )}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel className="date-range-label" htmlFor="end-date">
                          End Date
                        </FormLabel>
                        <Controller
                          name="endDate"
                          control={control}
                          // eslint-disable-next-line no-unused-vars
                          render={({ field: { onChange, value, ref } }) => (
                            <DatePicker
                              className="date-picker"
                              placeholderText="MM/DD/YYYY"
                              type="date"
                              selected={value}
                              onChange={onChange}
                              selectsEnd
                              startDate={startDate}
                              endDate={endDate}
                              minDate={startDate}
                            />
                          )}
                        />
                      </FormControl>
                    </div>
                  )}
                </div>
              </FormControl>
            </div>
            <div className="filter-choices">
              <FormControl
                className="section-wrapper filter-label-select"
                isInvalid={errors?.sortBy}
              >
                <FormLabel htmlFor="zip">Zip Code</FormLabel>
                <div className="input-drop-down">
                  <Select id="zip" className="select-filter-options" {...register('zipOption')}>
                    <option value="zip-code-all">All</option>
                    <option value="zip-code-custom">Custom</option>
                  </Select>
                  <Input
                    isInvalid={errors?.zipCode}
                    placeholder="e.g. 96162, 91007"
                    className={`custom-input ${zipOption === 'zip-code-custom' ? 'active' : ''}`}
                    {...register('zipCode')}
                  />
                  <p className="error-message">{errors.zipCode?.message}</p>
                </div>
              </FormControl>
            </div>
            <div className="filter-choices">
              <FormControl
                className="section-wrapper filter-label-select"
                isInvalid={errors?.sortBy}
              >
                <FormLabel htmlFor="launch-organic">Launch Organically?</FormLabel>
                <Controller
                  id="launch-organic"
                  name="launchOrg"
                  control={control}
                  // eslint-disable-next-line no-unused-vars
                  render={({ field: { onChange, value, ref } }) => (
                    <RadioGroup
                      className="organically-radio-group"
                      defaultValue="yes"
                      value={value}
                      onChange={onChange}
                    >
                      <Radio value="yes">Yes</Radio>
                      <Radio value="no">No</Radio>
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </div>
          </div>
          <FormControl className="section-wrapper">
            <div className="box-detail-header">
              <Text className="csv-form-labels">Box Details</Text>
              <Button
                variant="link"
                onClick={() => {
                  reset({
                    ...getValues(),
                    boxDetails: [],
                  });
                }}
              >
                Unselect All
              </Button>
            </div>
            <Controller
              name="boxDetails"
              control={control}
              // eslint-disable-next-line no-unused-vars
              render={({ field: { onChange, value, ref } }) => (
                <div className="box-detail-checkboxes">
                  <CheckboxGroup value={value} onChange={onChange}>
                    <Checkbox value="date">Date</Checkbox>
                    <Checkbox value="box-num">Box Number</Checkbox>
                    <Checkbox value="zip-code">Zip Code</Checkbox>
                    <Checkbox value="image">Image</Checkbox>
                    <Checkbox value="landmarks">Landmarks</Checkbox>
                    <Checkbox value="launch-type">Launch Type</Checkbox>
                    <Checkbox value="messages">Messages</Checkbox>
                  </CheckboxGroup>
                </div>
              )}
            />
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
