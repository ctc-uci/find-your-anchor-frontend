import React from 'react';
import PropTypes from 'prop-types';
import { Input, Checkbox, FormControl, FormErrorMessage } from '@chakra-ui/react';
import './EditableRow.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import BoxSchema from '../../UploadCSV/UploadCSVUtils';
import CheckIcon from '../../../assets/check.png';

const EditableRow = ({ editFormData, handleEditFormSubmit }) => {
  const {
    register,
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
    <tr className="edit-row" key={editFormData.id}>
      <td>
        <FormControl isInvalid={errors?.date}>
          <Input id="date" placeholder="MM/DD/YYYY" name="date" {...register('date')} />
          <FormErrorMessage marginTop="0px">{errors.date?.message}</FormErrorMessage>
        </FormControl>
      </td>
      <td>
        <FormControl isInvalid={errors?.boxNumber}>
          <Input id="boxNumber" placeholder="12345" name="boxNumber" {...register('boxNumber')} />
          <FormErrorMessage marginTop="0px">{errors.boxNumber?.message}</FormErrorMessage>
        </FormControl>
      </td>
      <td>
        <FormControl isInvalid={errors?.zipCode}>
          <Input id="zipCode" placeholder="e.g. 90210" name="zipCode" {...register('zipCode')} />
          <FormErrorMessage marginTop="0px">{errors.zipCode?.message}</FormErrorMessage>
        </FormControl>
      </td>
      <td>
        <Checkbox
          className="checkbox"
          name="launchedOrganically"
          {...register('launchedOrganically')}
        />
      </td>
      <td>
        <button type="button" onClick={handleSubmit(onSave)}>
          <img src={CheckIcon} alt="Check Icon" className="check-icon" />
        </button>
      </td>
    </tr>
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
