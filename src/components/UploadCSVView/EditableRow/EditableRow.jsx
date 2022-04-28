import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Input,
  InputGroup,
  InputRightElement,
  Checkbox,
  FormControl,
  FormLabel,
  Tooltip,
  Tr,
  Td,
  Flex,
} from '@chakra-ui/react';
import { WarningIcon, CheckIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker from 'react-datepicker';
import BoxSchema from '../../UploadCSV/UploadCSVUtils';
import styles from './EditableRow.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import useMobileWidth from '../../../common/useMobileWidth';

const EditableRow = ({
  editFormData,
  handleEditFormSubmit,
  isError,
  boxNumberMap,
  updateBoxNumberMap,
  lineNumber,
  isReadOnly = false,
  editRow = null,
  readData = null,
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
  const isMobile = useMobileWidth();

  // useRef is similar to useState, but allows us change
  // values without having to re-render the component.
  const boxNumRef = useRef(null);

  const handleEditFormSubmitError = () => {
    // Revert update to box map if new box number causes error
    updateBoxNumberMap(boxNumRef.current, lineNumber, editFormData.boxNumber);
  };

  const onSave = () => {
    boxNumRef.current = Number(getValues('boxNumber'));
    updateBoxNumberMap(editFormData.boxNumber, lineNumber, boxNumRef.current);
    handleSubmit(handleEditFormSubmit, handleEditFormSubmitError)();
  };

  // validate inputs when EditableRow first renders
  useEffect(() => {
    onSave();
    console.log('editable row mounted');
  }, []);

  const datePickerForm = () => {
    return (
      <FormControl isInvalid={errors?.date}>
        {isMobile && <FormLabel>Date</FormLabel>}
        <InputGroup>
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
                  readOnly={isReadOnly}
                />
              );
            }}
          />
          {errors?.date && (
            <Tooltip hasArrow label={errors.date?.message} bg="red.600">
              <InputRightElement className={styles['input-right-warning']}>
                <WarningIcon />
              </InputRightElement>
            </Tooltip>
          )}
        </InputGroup>
      </FormControl>
    );
  };

  const boxNumberForm = () => {
    return (
      <FormControl isReadOnly={isReadOnly} isInvalid={errors?.boxNumber}>
        {isMobile && <FormLabel>Box Number</FormLabel>}
        <InputGroup>
          <Input id="boxNumber" placeholder="12345" name="boxNumber" {...register('boxNumber')} />
          {errors?.boxNumber && (
            <Tooltip hasArrow label={errors.boxNumber?.message} bg="red.600">
              <InputRightElement className={styles['input-right-warning']}>
                <WarningIcon />
              </InputRightElement>
            </Tooltip>
          )}
          ;
        </InputGroup>
      </FormControl>
    );
  };

  const zipCodeForm = () => {
    return (
      <FormControl isReadOnly={isReadOnly} isInvalid={errors?.zipCode}>
        {isMobile && <FormLabel>Zip Code</FormLabel>}
        <InputGroup>
          <Input id="zipCode" placeholder="e.g. 90210" name="zipCode" {...register('zipCode')} />
          {errors?.zipCode && (
            <Tooltip hasArrow label={errors.zipCode?.message} bg="red.600">
              <InputRightElement className={styles['input-right-warning']}>
                <WarningIcon />
              </InputRightElement>
            </Tooltip>
          )}
          ;
        </InputGroup>
      </FormControl>
    );
  };

  const countryForm = () => {
    return (
      <FormControl isReadOnly={isReadOnly} isInvalid={errors['']?.message}>
        {isMobile && <FormLabel>Country</FormLabel>}
        <InputGroup>
          <Input id="country" placeholder="e.g. 90210" name="country" {...register('country')} />
          {errors['']?.message && (
            <Tooltip hasArrow label={errors['']?.message} bg="red.600">
              <InputRightElement className={styles['input-right-warning']}>
                <WarningIcon />
              </InputRightElement>
            </Tooltip>
          )}
          ;
        </InputGroup>
      </FormControl>
    );
  };

  if (!isMobile) {
    return (
      <Tr
        className={isError ? `${styles['edit-row']} ${styles['csv-error']}` : styles['edit-row']}
        key={editFormData.id}
      >
        <Td>{datePickerForm()}</Td>
        <Td>{boxNumberForm()}</Td>
        <Td>{zipCodeForm()}</Td>
        <Td>{countryForm()}</Td>
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
  }

  return (
    <Flex flexDirection="column" gap="20px" margin="0 30px">
      {boxNumberForm()}
      {datePickerForm()}
      {zipCodeForm()}
      {countryForm()}

      <FormControl
        isReadOnly={isReadOnly}
        display="flex"
        gap="10px"
        justify="flex-start"
        alignItems="baseline"
      >
        <Checkbox name="launchedOrganically" {...register('launchedOrganically')} />
        <FormLabel>Launched Organically?</FormLabel>
      </FormControl>

      <Flex justifyContent="flex-end" gap="30px">
        {isReadOnly ? (
          <button type="button" onClick={e => editRow(e, readData, -1, true)}>
            <EditIcon w={6} h={6} alt="Edit Icon" />
          </button>
        ) : (
          <button type="button" onClick={onSave}>
            <CheckIcon color="#38A169" w={6} h={6} alt="Check Icon" />
          </button>
        )}
        <button type="button">
          <DeleteIcon color="#E53E3E" w={6} h={6} alt="Delete Icon" />
        </button>
      </Flex>
    </Flex>
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
  isReadOnly: PropTypes.bool.isRequired,
  editRow: PropTypes.func.isRequired,
  readData: PropTypes.shape({
    id: PropTypes.number,
    values: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      date: PropTypes.string,
      boxNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      zipCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      country: PropTypes.string,
      launchedOrganically: PropTypes.bool,
    }),
    original: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      date: PropTypes.string,
      boxNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      zipCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      country: PropTypes.string,
      launchedOrganically: PropTypes.bool,
    }),
  }).isRequired,
};

export default EditableRow;
