import React, { useEffect } from 'react';
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
import styles from './ExportCSVForm.module.css';
import { isValidRange, isZip, isDate } from './ExportCSVFormValidators';

yup.addMethod(yup.mixed, 'isDate', isDate);
yup.addMethod(yup.mixed, 'isZip', isZip);
yup.addMethod(yup.mixed, 'isValidRange', isValidRange);
const schema = yup
  .object({
    zipOption: yup.string(),
    zipCode: yup.mixed().when('zipOption', {
      is: 'zip-code-custom',
      then: yup.mixed().isZip(),
      otherwise: yup.mixed().nullable().notRequired(),
    }),
    boxOption: yup.string(),
    boxRange: yup.mixed().when('boxOption', {
      is: 'boxes-custom',
      then: yup.mixed().isValidRange(),
      otherwise: yup.mixed().nullable().notRequired(),
    }),
    dateOption: yup.string(),
    singleDate: yup.mixed().when('dateOption', {
      is: 'date-single',
      then: yup.mixed().isDate(),
      otherwise: yup.mixed().nullable().notRequired(),
    }),
    startDate: yup.mixed().when('dateOption', {
      is: 'date-range',
      then: yup.mixed().isDate(),
      otherwise: yup.mixed().nullable().notRequired(),
    }),
    endDate: yup.mixed().when('dateOption', {
      is: 'date-range',
      then: yup.mixed().isDate(),
      otherwise: yup.mixed().nullable().notRequired(),
    }),
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
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sortBy: 'ascend-box-num',
      boxOption: 'boxes-all',
      boxRange: '',
      dateOption: 'date-all',
      singleDate: '',
      startDate: '',
      endDate: '',
      zipOption: 'zip-code-all',
      zipCode: '',
      launchOrg: 'yes',
      boxDetails: [],
    },
    resolver: yupResolver(schema),
    delayError: 750,
  });

  const onSubmit = data => {
    setFormValues(data);
    // alert('submitted');
    // reset();
  };

  const [boxOption, dateOption, startDate, endDate, zipOption] = watch([
    'boxOption',
    'dateOption',
    'startDate',
    'endDate',
    'zipOption',
  ]);

  useEffect(() => {
    if (boxOption === 'boxes-all') {
      setValue('boxRange', '');
      clearErrors('boxRange');
    }

    if (zipOption === 'zip-code-all') {
      setValue('zipCode', '');
      clearErrors('zipCode');
    }

    if (dateOption === 'date-all') {
      setValue('singleDate', '');
      setValue('startDate', '');
      setValue('endDate', '');
      clearErrors(['singleDate', 'rangeDate']);
    } else if (dateOption === 'date-single') {
      setValue('startDate', '');
      setValue('endDate', '');
      clearErrors('rangeDate');
    } else {
      setValue('singleDate', '');
      clearErrors('singleDate');
    }
    // handleSubmit(onSubmit)
  }, [boxOption, zipOption, dateOption]);

  return (
    <div className={styles['csv-form-wrapper']}>
      <form id={formID} className={styles['export-csv-form']} onSubmit={handleSubmit(onSubmit)}>
        <FormControl className={styles['section-wrapper']}>
          <FormLabel htmlFor="sort-by" className={styles['csv-form-labels']}>
            Sort By
          </FormLabel>
          <Select id="sort-by" {...register('sortBy')}>
            <option value="ascend-box-num">Ascending Box Number</option>
            <option value="descend-box-num">Descending Box Number</option>
            <option value="chronologic">Chronologically</option>
            <option value="ascend-zip-code">Ascending Zip Code</option>
            <option value="descend-zip-code">Descending Zip Code</option>
          </Select>
        </FormControl>

        <div className={styles['filter-section-wrapper']}>
          <div className={styles['filter-option-wrapper']}>
            <Text className={styles['csv-form-labels']}>Filter Options</Text>
            <div className={styles['filter-choices']}>
              <FormControl className={styles['filter-label-select']} isInvalid={errors?.sortBy}>
                <FormLabel htmlFor="boxes">Boxes</FormLabel>
                <div className={styles['input-drop-down']}>
                  <Select
                    id="boxes"
                    className={styles['select-filter-options']}
                    {...register('boxOption')}
                  >
                    <option value="boxes-all">All</option>
                    <option value="boxes-custom">Custom</option>
                  </Select>
                  {boxOption === 'boxes-custom' && (
                    <Input
                      isInvalid={errors?.boxRange}
                      placeholder="e.g. 1-9, 6, 12"
                      {...register('boxRange')}
                      className={styles['custom-input']}
                    />
                  )}
                  <p className={styles['error-message']}>{errors.boxRange?.message}</p>
                </div>
              </FormControl>
            </div>
            <div className={styles['filter-choices']}>
              <FormControl className={styles['filter-label-select']} isInvalid={errors?.sortBy}>
                <FormLabel htmlFor="date">Date</FormLabel>
                <div className={styles['input-drop-down']}>
                  <Select
                    id="date"
                    className={styles['select-filter-options']}
                    {...register('dateOption')}
                  >
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
                          className={styles[`date-picker${errors?.singleDate ? '-error' : ''}`]}
                          placeholderText="MM/DD/YYYY"
                          type="date"
                          selected={value}
                          onChange={onChange}
                        />
                      )}
                    />
                  )}
                  <p className={styles['error-message']}>{errors.singleDate?.message}</p>
                  {dateOption === 'date-range' && (
                    <div className={styles['date-range']}>
                      <FormControl>
                        <FormLabel className={styles['date-range-label']} htmlFor="start-date">
                          Start Date
                        </FormLabel>
                        <Controller
                          name="startDate"
                          control={control}
                          // eslint-disable-next-line no-unused-vars
                          render={({ field: { onChange, value, ref } }) => (
                            <DatePicker
                              className={styles[`date-picker${errors?.startDate ? '-error' : ''}`]}
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
                      <p className={styles['error-message']}>{errors.startDate?.message}</p>
                      <FormControl>
                        <FormLabel className={styles['date-range-label']} htmlFor="end-date">
                          End Date
                        </FormLabel>
                        <Controller
                          name="endDate"
                          control={control}
                          // eslint-disable-next-line no-unused-vars
                          render={({ field: { onChange, value, ref } }) => (
                            <DatePicker
                              className={styles[`date-picker${errors?.endDate ? '-error' : ''}`]}
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
                      <p className={styles['error-message']}>{errors.endDate?.message}</p>
                    </div>
                  )}
                </div>
              </FormControl>
            </div>
            <div className={styles['filter-choices']}>
              <FormControl className={styles['filter-label-select']} isInvalid={errors?.sortBy}>
                <FormLabel htmlFor="zip">Zip Code</FormLabel>
                <div className={styles['input-drop-down']}>
                  <Select
                    id="zip"
                    className={styles['select-filter-options']}
                    {...register('zipOption')}
                  >
                    <option value="zip-code-all">All</option>
                    <option value="zip-code-custom">Custom</option>
                  </Select>
                  {zipOption === 'zip-code-custom' && (
                    <Input
                      isInvalid={errors?.zipCode}
                      placeholder="e.g. 96162, 91007"
                      className={styles['custom-input']}
                      {...register('zipCode')}
                    />
                  )}
                  <p className={styles['error-message']}>{errors.zipCode?.message}</p>
                </div>
              </FormControl>
            </div>
            <div className={styles['filter-choices']}>
              <FormControl className={styles['filter-label-select']} isInvalid={errors?.sortBy}>
                <FormLabel htmlFor="launch-organic">Launch Organically?</FormLabel>
                <Controller
                  id="launch-organic"
                  name="launchOrg"
                  control={control}
                  // eslint-disable-next-line no-unused-vars
                  render={({ field: { onChange, value, ref } }) => (
                    <RadioGroup
                      className={styles['organically-radio-group']}
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
          <FormControl className={styles['section-wrapper']}>
            <div className={styles['box-detail-header']}>
              <Text className={styles['csv-form-labels']}>Box Details</Text>
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
                <div className={styles['box-detail-checkboxes']}>
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
