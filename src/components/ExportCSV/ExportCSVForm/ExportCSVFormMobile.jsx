/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import DatePicker from 'react-datepicker';
import useDeepCompareEffect from 'use-deep-compare-effect';
import * as yup from 'yup';

import {
  FormControl,
  // FormLabel,
  // Input,
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
} from '@chakra-ui/react';
// import { CheckIcon } from '@chakra-ui/icons'
import AccordionTemplate from '../../../common/CommonAccordionSelector/CommonAccordionSelector';
import styles from './ExportCSVForm.module.css';
import { formatDate, FYABackend } from '../../../common/utils';
import { isValidRange, isZip, isDate } from './ExportCSVFormValidators';

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

  const {
    control,
    reset,
    getValues,
    // register,
    handleSubmit,
    setValue,
    clearErrors,
    // formState: { errors },
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
      launchedOrganically: 'yes',
      boxDetails: [],
    },
    resolver: yupResolver(schema),
    delayError: 750,
  });

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

    const res = await FYABackend.post('/exportCSV/boxes', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // if there are matching records
    if (res.data.length > 0) {
      navigate('/export-csv-preview', { state: { rows: res.data } });
    } else {
      // TODO: display toast component
      console.log('no matching records');
    }
  };

  return (
    <div className={styles['csv-form-wrapper']}>
      <form id={formID} className={styles['export-csv-form']} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles['accordion-box']}>
          <AccordionTemplate
            headerText="Sort By"
            options={[
              'Ascending Box Number',
              'Ascending Zip Code',
              'Chronologically',
              'Descending Box Number',
              'Descending Zip Code',
            ]}
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
                <AccordionTemplate
                  headerText="Boxes"
                  options={['All Boxes', 'Custom']}
                  isHeader={false}
                />
                <AccordionTemplate
                  headerText="Date"
                  options={['All Boxes', 'Single Date', 'Range']}
                  isHeader={false}
                />
                <AccordionTemplate
                  headerText="Zip Code"
                  options={['All', 'By Zip Code', 'By State']}
                  isHeader={false}
                />
                <AccordionTemplate
                  headerText="Launched Organically?"
                  options={['Yes', 'No']}
                  isHeader={false}
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

        <div className={styles['accordion-box']}>
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton>
                <Text className={styles['csv-form-labels']}>CSV Preview</Text>
                <AccordionIcon />
              </AccordionButton>
            </AccordionItem>
          </Accordion>
        </div>
      </form>

      <div className={styles['buttons-container']}>
        <Button border="1px" borderColor="#CBD5E0" bg="white">
          Cancel
        </Button>
        <Button textColor="white" bg="#345E80">
          Export
        </Button>
      </div>
    </div>
  );
};

ExportCSVForm.propTypes = {
  formID: PropTypes.string.isRequired,
};

export default ExportCSVForm;
