/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import { React, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeftIcon } from '@chakra-ui/icons';
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
  // Select,
  Text,
  // Radio,
  // RadioGroup,
  Checkbox,
  CheckboxGroup,
  Button,
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  AccordionButton,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerBody,
  DrawerHeader,
  // Box,
  // Stack,
} from '@chakra-ui/react';
import { Select as ReactSelect } from 'chakra-react-select';
import countryList from 'react-select-country-list';
import AccordionTemplate from '../../../common/CommonAccordionSelector/CommonAccordionSelector';
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
    boxOption: yup.string(),
    boxRange: yup.mixed().when('boxOption', {
      is: 'boxes-custom',
      then: yup.mixed().isValidRange(),
      otherwise: yup.mixed().nullable().notRequired(),
    }),
    countryOption: yup.string(),
    country: yup.mixed().when('countryOption', {
      is: 'country-custom',
      then: yup.object({
        label: yup.string(),
        value: yup.string(),
      }),
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

  const { isOpen: singleDateInputOpen, onToggle: singleDateInputToggle } = useDisclosure();

  const { isOpen: customBoxInputOpen, onToggle: customBoxInputToggle } = useDisclosure();

  const { isOpen: rangeDateInputOpen, onToggle: rangeDateInputToggle } = useDisclosure();

  const { isOpen: customZipInputOpen, onToggle: customZipInputToggle } = useDisclosure();

  const { isOpen: customCountryInputOpen, onToggle: customCountryInputToggle } = useDisclosure();

  const {
    control,
    reset,
    getValues,
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isValid },
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
      country: '',
      launchedOrganically: 'yes',
      boxDetails: [],
    },
    resolver: yupResolver(schema),
    delayError: 750,
    mode: 'onChange',
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

    if (watchAllFields.countryOption === 'country-all') {
      setValue('country', '');
      clearErrors('country');
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
    try {
      // if there are matching records
      if (res.data.length > 0) {
        navigate('/export-csv-preview', { state: { rows: res.data } });
      } else {
        showToast({
          title: 'No Matching Records',
          message: `There was no records that matched your query`,
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
        <div className={styles['accordion-box']}>
          <Controller
            control={control}
            name="sortBy"
            render={({ field: { value, onChange } }) => (
              <AccordionTemplate
                headerText="Sort By"
                options={[
                  { name: 'Ascending Box Number', value: 'ascend-box-num' },
                  { name: 'Ascending Zip Code', value: 'ascend-zip-code' },
                  { name: 'Chronologically', value: 'chronologic' },
                  { name: 'Descending Box Number', value: 'descend-box-num' },
                  { name: 'Descending Zip Code', value: 'descend-zip-num' },
                ]}
                inputValue={value}
                setValue={onChange}
              />
            )}
          />
        </div>

        <div className={styles['accordion-box']}>
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton>
                <Text className={styles['csv-form-labels']}>Filter Options</Text>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <Controller
                  control={control}
                  name="boxOption"
                  render={({ field: { value, onChange } }) => (
                    <AccordionTemplate
                      headerText="Boxes"
                      options={[
                        { name: 'All Boxes', value: 'boxes-all' },
                        {
                          name: 'Custom',
                          value: 'boxes-custom',
                          setAdditionalValueInput: customBoxInputToggle,
                          additionalValue: getValues('boxRange'),
                        },
                      ]}
                      isHeader={false}
                      isInPlane={true}
                      inputValue={value}
                      setValue={onChange}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="dateOption"
                  render={({ field: { value, onChange } }) => (
                    <AccordionTemplate
                      headerText="Date"
                      options={[
                        { name: 'All', value: 'date-all' },
                        {
                          name: 'Single Date',
                          value: 'date-single',
                          setAdditionalValueInput: singleDateInputToggle,
                          additionalValue: getValues('singleDate')
                            ? formatDate(getValues('singleDate'))
                            : undefined,
                        },
                        {
                          name: 'Range',
                          value: 'date-range',
                          setAdditionalValueInput: rangeDateInputToggle,
                          additionalValue:
                            getValues('startDate') && getValues('endDate')
                              ? `${formatDate(getValues('startDate'))} - ${formatDate(
                                  getValues('endDate'),
                                )}`
                              : undefined,
                        },
                      ]}
                      isHeader={false}
                      isInPlane={true}
                      inputValue={value}
                      setValue={onChange}
                      setAdditionalValueInput={singleDateInputToggle}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="zipOption"
                  render={({ field: { value, onChange } }) => (
                    <AccordionTemplate
                      headerText="Zip Code"
                      options={[
                        { name: 'All', value: 'zip-code-all' },
                        {
                          name: 'Custom',
                          value: 'zip-code-custom',
                          setAdditionalValueInput: customZipInputToggle,
                          additionalValue: getValues('zipCode'),
                        },
                      ]}
                      isHeader={false}
                      isInPlane={true}
                      inputValue={value}
                      setValue={onChange}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="countryOption"
                  render={({ field: { value, onChange } }) => (
                    <AccordionTemplate
                      headerText="Country"
                      options={[
                        { name: 'All', value: 'country-all' },
                        {
                          name: 'Custom',
                          value: 'country-custom',
                          setAdditionalValueInput: customCountryInputToggle,
                          additionalValue: getValues('country')
                            ? getValues('country').label
                            : undefined,
                        },
                      ]}
                      isHeader={false}
                      isInPlane={true}
                      inputValue={value}
                      setValue={onChange}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="launchedOrganically"
                  render={({ field: { value, onChange } }) => (
                    <AccordionTemplate
                      headerText="Launched Organically?"
                      options={[
                        { name: 'Yes', value: 'yes' },
                        { name: 'No', value: 'no' },
                      ]}
                      isHeader={false}
                      isInPlane={true}
                      inputValue={value}
                      setValue={onChange}
                    />
                  )}
                />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </div>

        <div className={styles['accordion-box']}>
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton>
                <Text className={styles['csv-form-labels']}>Box Details</Text>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <FormControl className={styles['section-wrapper']}>
                  <div className={styles['box-detail-header']}>
                    <Button
                      textColor="#319795"
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
                          <Checkbox value="picture">Image</Checkbox>
                          <Checkbox value="general_location">Landmarks</Checkbox>
                          <Checkbox value="launched_organically">Launch Type</Checkbox>
                          <Checkbox value="message">Messages</Checkbox>
                        </CheckboxGroup>
                      </div>
                    )}
                  />
                </FormControl>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </div>
        {/* TODO: CSV Preview Flow for Mobile View */}
        {/* <Box className={styles['preview-csv-button']} onClick={handleSubmit(onSubmit)}>
          <Text className={styles['csv-form-labels']}>CSV Preview</Text>
          <ChevronRightIcon boxSize={6} />
        </Box> */}
        <Drawer onToggle={customBoxInputToggle} isOpen={customBoxInputOpen} size="full">
          <DrawerContent>
            <ChevronLeftIcon
              className={styles['back-button']}
              boxSize={7}
              onClick={() => (isValid ? customBoxInputToggle() : undefined)}
            />
            <DrawerHeader className={styles['additional-input-header']}>Boxes</DrawerHeader>
            <DrawerBody>
              <FormControl isInvalid={errors?.sortBy}>
                <FormLabel htmlFor="boxes">Custom Range</FormLabel>
                {watchAllFields.boxOption === 'boxes-custom' && (
                  <Input
                    isInvalid={errors?.boxRange}
                    placeholder="e.g. 1-9, 6, 12"
                    {...register('boxRange')}
                    className={styles['custom-input']}
                  />
                )}
                <p className={styles['error-message']}>{errors.boxRange?.message}</p>
              </FormControl>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        <Drawer
          onToggle={singleDateInputToggle}
          isOpen={singleDateInputOpen}
          size="full"
          trapFocus={false}
        >
          <DrawerContent>
            <ChevronLeftIcon
              className={styles['back-button']}
              boxSize={7}
              onClick={() => (isValid ? singleDateInputToggle() : undefined)}
            />
            <DrawerHeader className={styles['additional-input-header']}>Date</DrawerHeader>
            <DrawerBody>
              <FormControl isInvalid={errors?.sortBy}>
                <FormLabel htmlFor="date-single">Single Date</FormLabel>
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
              </FormControl>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <Drawer
          onToggle={rangeDateInputToggle}
          isOpen={rangeDateInputOpen}
          size="full"
          trapFocus={false}
        >
          <DrawerContent>
            <ChevronLeftIcon
              className={styles['back-button']}
              boxSize={7}
              onClick={() => (isValid ? rangeDateInputToggle() : undefined)}
            />
            <DrawerHeader className={styles['additional-input-header']}>Date</DrawerHeader>
            <DrawerBody>
              <FormLabel htmlFor="date-range">Range</FormLabel>
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
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <Drawer onToggle={customZipInputToggle} isOpen={customZipInputOpen} size="full">
          <DrawerContent>
            <ChevronLeftIcon
              className={styles['back-button']}
              boxSize={7}
              onClick={() => (isValid ? customZipInputToggle() : undefined)}
            />
            <DrawerHeader className={styles['additional-input-header']}>Zip Code</DrawerHeader>
            <DrawerBody>
              <FormControl isInvalid={errors?.sortBy}>
                <FormLabel htmlFor="zip">Custom</FormLabel>
                {watchAllFields.zipOption === 'zip-code-custom' && (
                  <Input
                    isInvalid={errors?.zipCode}
                    placeholder="e.g. 96162, 91007"
                    className={styles['custom-input']}
                    {...register('zipCode')}
                  />
                )}
              </FormControl>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        <Drawer onToggle={customCountryInputToggle} isOpen={customCountryInputOpen} size="full">
          <DrawerContent>
            <ChevronLeftIcon
              className={styles['back-button']}
              boxSize={7}
              onClick={() => (isValid ? customCountryInputToggle() : console.log(isValid))}
            />
            <DrawerHeader className={styles['additional-input-header']}>Country</DrawerHeader>
            <DrawerBody>
              <FormControl isInvalid={errors?.sortBy}>
                <FormLabel htmlFor="country">Custom</FormLabel>
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
              </FormControl>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <div className={styles['buttons-container']}>
          <Button border="1px" borderColor="#CBD5E0" bg="white" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button textColor="white" bg="#345E80" type="submit">
            Preview CSV
          </Button>
        </div>
      </form>
    </div>
  );
};

ExportCSVForm.propTypes = {
  formID: PropTypes.string.isRequired,
};

export default ExportCSVForm;
