import React from 'react';
import PropTypes from 'prop-types';
import {
  Input,
  InputGroup,
  InputRightElement,
  Checkbox,
  FormControl,
  FormErrorMessage,
  Tr,
  Td,
} from '@chakra-ui/react';
import { WarningIcon, CheckIcon } from '@chakra-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker from 'react-datepicker';
import BoxSchema from '../../UploadCSV/UploadCSVUtils';
import styles from './EditableRow.module.css';
import 'react-datepicker/dist/react-datepicker.css';

const EditableRow = ({
  editFormData,
  handleEditFormSubmit,
  isError,
  boxNumberMap,
  updateBoxNumberMap,
  lineNumber,
}) => {
  const {
    register,
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(BoxSchema),
    context: boxNumberMap,
    defaultValues: {
      date: editFormData.date,
      boxNumber: editFormData.boxNumber,
      zipCode: editFormData.zipCode,
      country: editFormData.country,
      launchedOrganically: editFormData.launchedOrganically,
    },
    delayError: 750,
  });

  const handleEditFormSubmitError = err => {
    // Revert update to box map if new box number causes error
    const oldBoxNum = Number(err.boxNumber.message.split(': ')[1]);
    updateBoxNumberMap(oldBoxNum, lineNumber, editFormData.boxNumber);
  };

  const onSave = () => {
    const newBoxNum = Number(getValues('boxNumber'));
    updateBoxNumberMap(editFormData.boxNumber, lineNumber, newBoxNum);
    handleSubmit(handleEditFormSubmit, handleEditFormSubmitError)();
  };

  return (
    <Tr
      className={isError ? `${styles['edit-row']} ${styles['csv-error']}` : styles['edit-row']}
      key={editFormData.id}
    >
      <Td>
        <FormControl isInvalid={errors?.date}>
          <Controller
            control={control}
            name="date"
            // eslint-disable-next-line no-unused-vars
            render={({ field: { onChange, value, ref } }) => {
              const date = new Date(value);
              return (
                <DatePicker
                  placeholderText="MM/DD/YYYY"
                  className={
                    errors?.date
                      ? `${styles['date-picker']} ${styles['date-picker-error']}`
                      : styles['date-picker']
                  }
                  type="date"
                  selected={Number.isNaN(Date.parse(date)) ? undefined : date}
                  onChange={onChange}
                />
              );
            }}
          />
          <FormErrorMessage marginTop="0px">{errors.date?.message}</FormErrorMessage>
        </FormControl>
      </Td>
      <Td>
        <FormControl isInvalid={errors?.boxNumber}>
          <InputGroup>
            <Input id="boxNumber" placeholder="12345" name="boxNumber" {...register('boxNumber')} />
            {errors?.boxNumber && (
              <InputRightElement className={styles['input-right-warning']}>
                <WarningIcon />
              </InputRightElement>
            )}
            ;
          </InputGroup>
          <FormErrorMessage marginTop="0px">{errors.boxNumber?.message}</FormErrorMessage>
        </FormControl>
      </Td>
      <Td>
        <FormControl isInvalid={errors?.zipCode}>
          <InputGroup>
            <Input id="zipCode" placeholder="e.g. 90210" name="zipCode" {...register('zipCode')} />
            {errors?.zipCode && (
              <InputRightElement className={styles['input-right-warning']}>
                <WarningIcon />
              </InputRightElement>
            )}
            ;
          </InputGroup>
          <FormErrorMessage marginTop="0px">{errors.zipCode?.message}</FormErrorMessage>
        </FormControl>
      </Td>
      <Td>
        <FormControl isInvalid={errors['']?.message}>
          <InputGroup>
            <Input id="country" placeholder="e.g. 90210" name="country" {...register('country')} />
            {errors['']?.message && (
              <InputRightElement className={styles['input-right-warning']}>
                <WarningIcon />
              </InputRightElement>
            )}
            ;
          </InputGroup>
          <FormErrorMessage marginTop="0px">{errors['']?.message}</FormErrorMessage>
        </FormControl>
      </Td>
      <Td>
        <Checkbox
          className={styles['check-box']}
          name="launchedOrganically"
          {...register('launchedOrganically')}
        />
      </Td>
      <Td>
        <button type="button" onClick={onSave}>
          <CheckIcon alt="Check Icon" className={styles['check-icon']} />
        </button>
      </Td>
    </Tr>
  );
};

EditableRow.propTypes = {
  editFormData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    date: PropTypes.string,
    boxNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    zipCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    country: PropTypes.string,
    launchedOrganically: PropTypes.bool,
  }).isRequired,
  handleEditFormSubmit: PropTypes.func.isRequired,
  isError: PropTypes.bool.isRequired,
  boxNumberMap: PropTypes.instanceOf(Map).isRequired,
  updateBoxNumberMap: PropTypes.func.isRequired,
  lineNumber: PropTypes.number.isRequired,
};

export default EditableRow;
