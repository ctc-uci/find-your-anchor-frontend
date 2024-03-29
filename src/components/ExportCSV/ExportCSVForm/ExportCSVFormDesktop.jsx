import { React, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker from 'react-datepicker';
import useDeepCompareEffect from 'use-deep-compare-effect';
import * as yup from 'yup';

import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  Checkbox,
  CheckboxGroup,
  Button,
} from '@chakra-ui/react';
import { Select as ReactSelect } from 'chakra-react-select';
import countryList from 'react-select-country-list';
import styles from './ExportCSVForm.module.css';
import { formatDate, FYABackend } from '../../../common/utils';
import { isValidRange, isZip, isDate } from './ExportCSVFormValidators';
import { useCustomToast } from '../../ToastProvider/ToastProvider';

// yup validation
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
    countryOption: yup.string(),
    country: yup.mixed().when('countryOption', {
      is: 'country-custom',
      then: yup.object({
        label: yup.string().required('Invalid country, please select a country'),
        value: yup.string().required('Invalid country, please select a country'),
      }),
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

const ExportCSVForm = ({ formID }) => {
  const navigate = useNavigate();
  const countryOptions = useMemo(() => countryList().getData(), []);

  const {
    control,
    reset,
    getValues,
    register,
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
      countryOption: 'country-all',
      launchedOrganically: ['yes', 'no'],
      boxDetails: [
        'date',
        'box_id',
        'zip_code',
        'picture',
        'general_location',
        'launched_organically',
        'message',
        'country',
      ],
    },
    resolver: yupResolver(schema),
    delayError: 750,
  });
  const { showToast } = useCustomToast();
  const watchAllFields = useWatch({
    control,
  });

  // using deep compare effect because watch always
  // assigns new value every render
  useDeepCompareEffect(() => {
    if (watchAllFields.boxOption === 'boxes-all') {
      setValue('boxRange', '');
      clearErrors('boxRange');
    }

    if (watchAllFields.zipOption === 'zip-code-all') {
      setValue('zipCode', '');
      clearErrors('zipCode');
    }

    if (watchAllFields.dateOption === 'date-all') {
      setValue('singleDate', '');
      setValue('startDate', '');
      setValue('endDate', '');
      clearErrors(['singleDate', 'rangeDate']);
    } else if (watchAllFields.dateOption === 'date-single') {
      setValue('startDate', '');
      setValue('endDate', '');
      clearErrors('rangeDate');
    } else {
      setValue('singleDate', '');
      clearErrors('singleDate');
    }

    if (watchAllFields.countryOption === 'country-all') {
      setValue('country', '');
      clearErrors('country');
    }
  }, [watchAllFields]);

  const onSubmit = async data => {
    const importOrder = [
      'date',
      'box_id',
      'zip_code',
      'picture',
      'general_location',
      'launched_organically',
      'message',
    ];

    const sortByObject = importOrder.reduce((obj, item, index) => {
      return {
        ...obj,
        [item]: index,
      };
    }, {});

    const formData = data;
    formData.boxDetails.sort((a, b) => sortByObject[a] - sortByObject[b]);

    if (data.dateOption === 'date-range') {
      formData.startDate = formatDate(data.startDate);
      formData.endDate = formatDate(data.endDate);
    } else if (data.dateOption === 'date-single') {
      formData.singleDate = formatDate(data.singleDate);
    }

    if (data.countryOption === 'country-custom') formData.country = formData.country.value;

    const res = await FYABackend.post('/exportCSV/boxes', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // if there are matching records
    try {
      // if there are matching records
      if (res.data.length > 0) {
        navigate('/export-csv-preview', { state: { rows: res.data } });
      } else {
        showToast({
          title: 'Preview Unavailable',
          message: `No records match your selected filters`,
          toastPosition: 'bottom-right',
          type: 'error',
        });
      }
    } catch (err) {
      showToast({
        title: 'Error Exporting CSV',
        message: err.message || err.statusText,
        toastPosition: 'bottom-right',
        type: 'error',
      });
    }
  };

  return (
    <div className={styles['csv-form-wrapper']}>
      <form id={formID} className={styles['export-csv-form']} onSubmit={handleSubmit(onSubmit)}>
        <FormControl className={styles['section-wrapper']}>
          <Text className={styles['csv-form-labels']}>Sort By</Text>
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
                  {watchAllFields.boxOption === 'boxes-custom' && (
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
                  {watchAllFields.dateOption === 'date-single' && (
                    <Controller
                      name="singleDate"
                      control={control}
                      // eslint-disable-next-line no-unused-vars
                      render={({ field: { onChange, value, ref } }) => (
                        <DatePicker
                          className={
                            styles[`${errors?.singleDate ? 'date-picker-error' : 'date-picker'}`]
                          }
                          placeholderText="MM/DD/YYYY"
                          type="date"
                          selected={value}
                          onChange={onChange}
                        />
                      )}
                    />
                  )}
                  <p className={styles['error-message']}>{errors.singleDate?.message}</p>
                  {watchAllFields.dateOption === 'date-range' && (
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
                              className={
                                styles[`${errors?.startDate ? 'date-picker-error' : 'date-picker'}`]
                              }
                              placeholderText="MM/DD/YYYY"
                              type="date"
                              selected={value}
                              onChange={onChange}
                              selectsStart
                              startDate={watchAllFields.startDate}
                              endDate={watchAllFields.endDate}
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
                              className={
                                styles[`${errors?.endDate ? 'date-picker-error' : 'date-picker'}`]
                              }
                              placeholderText="MM/DD/YYYY"
                              type="date"
                              selected={value}
                              onChange={onChange}
                              selectsEnd
                              startDate={watchAllFields.startDate}
                              endDate={watchAllFields.endDate}
                              minDate={watchAllFields.startDate}
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
                  {watchAllFields.zipOption === 'zip-code-custom' && (
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
                <FormLabel htmlFor="country">Country</FormLabel>
                <div className={styles['input-drop-down']}>
                  <Select
                    id="country"
                    className={styles['select-filter-options']}
                    {...register('countryOption')}
                  >
                    <option value="country-all">All</option>
                    <option value="country-custom">Custom</option>
                  </Select>
                  {watchAllFields.countryOption === 'country-custom' && (
                    <Controller
                      control={control}
                      name="country"
                      // eslint-disable-next-line no-unused-vars
                      render={({ field: { onChange, value, ref } }) => (
                        <ReactSelect options={countryOptions} value={value} onChange={onChange} />
                      )}
                    />
                  )}
                  <p className={styles['error-message']}>{errors.country?.message}</p>
                </div>
              </FormControl>
            </div>
            <div className={styles['filter-choices']}>
              <FormControl className={styles['filter-label-select']} isInvalid={errors?.sortBy}>
                <FormLabel htmlFor="launch-organic">Launch Organically?</FormLabel>
                <Controller
                  id="launch-organic"
                  name="launchedOrganically"
                  control={control}
                  // eslint-disable-next-line no-unused-vars
                  render={({ field: { onChange, value, ref } }) => (
                    <CheckboxGroup
                      className={styles['organically-radio-group']}
                      // defaultValue="yes"
                      value={value}
                      onChange={onChange}
                    >
                      <Checkbox value="yes">Yes</Checkbox>
                      <Checkbox value="no">No</Checkbox>
                    </CheckboxGroup>
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
                    <Checkbox value="box_id">Box Number</Checkbox>
                    <Checkbox value="zip_code">Zip Code</Checkbox>
                    <Checkbox value="country">Country</Checkbox>
                    <Checkbox value="picture">Image</Checkbox>
                    <Checkbox value="general_location">Landmarks</Checkbox>
                    <Checkbox value="launched_organically">Launch Type</Checkbox>
                    <Checkbox value="message">Messages</Checkbox>
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
};

export default ExportCSVForm;
