import React from 'react';
import PropTypes from 'prop-types';
import { Input, Checkbox } from '@chakra-ui/react';
import './EditableRow.css';
import CheckIcon from '../../../assets/check.png';

const EditableRow = ({ editFormData, handleEditFormChange }) => {
  return (
    <tr className="edit-row" key={editFormData.id}>
      <td>
        <Input
          id="date"
          placeholder="MM/DD/YYYY"
          name="date"
          value={editFormData.date}
          onChange={e => handleEditFormChange(e)}
        />
      </td>
      <td>
        <Input
          id="boxNumber"
          placeholder="12345"
          name="boxNumber"
          value={editFormData.boxNumber}
          onChange={e => handleEditFormChange(e)}
        />
      </td>
      <td>
        <Input
          id="zipCode"
          placeholder="e.g. 90210"
          name="zipCode"
          value={editFormData.zipCode}
          onChange={e => handleEditFormChange(e)}
        />
      </td>
      <td>
        <Checkbox
          className="checkbox"
          name="launchedOrganically"
          onChange={e => handleEditFormChange(e)}
        />
      </td>
      <td>
        <button type="submit">
          <img src={CheckIcon} alt="Check Icon" className="check-icon" />
        </button>
      </td>
    </tr>
  );
};

EditableRow.propTypes = {
  editFormData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    date: PropTypes.string,
    boxNumber: PropTypes.string,
    zipCode: PropTypes.string,
    launchedOrganically: PropTypes.string,
  }).isRequired,
  handleEditFormChange: PropTypes.func.isRequired,
};

export default EditableRow;
