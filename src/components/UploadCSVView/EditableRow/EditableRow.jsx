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
import './EditableRow.css';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker from 'react-datepicker';
import BoxSchema from '../../UploadCSV/UploadCSVUtils';

const EditableRow = ({ editFormData, handleEditFormSubmit }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(BoxSchema),
    defaultValues: {
      date: editFormData.date,
      boxNumber: editFormData.boxNumber,
      zipCode: editFormData.zipCode,
      launchedOrganically: editFormData.launchedOrganically,
    },
    delayError: 750,
  });

  const onSave = editRowData => {
    handleEditFormSubmit(editRowData);
  };

  return (
    <Tr className="edit-row" key={editFormData.id}>
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
                  className={errors?.date ? 'date-picker date-picker-error' : 'date-picker'}
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
              <InputRightElement className="input-right-warning">
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
              <InputRightElement className="input-right-warning">
                <WarningIcon />
              </InputRightElement>
            )}
            ;
          </InputGroup>
          <FormErrorMessage marginTop="0px">{errors.zipCode?.message}</FormErrorMessage>
        </FormControl>
      </Td>
      <Td>
        <Checkbox
          className="checkbox"
          name="launchedOrganically"
          {...register('launchedOrganically')}
        />
      </Td>
      <Td>
        <button type="button" onClick={handleSubmit(onSave)}>
          <CheckIcon alt="Check Icon" className="check-icon" />
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
    launchedOrganically: PropTypes.bool,
  }).isRequired,
  handleEditFormSubmit: PropTypes.func.isRequired,
};

export default EditableRow;
