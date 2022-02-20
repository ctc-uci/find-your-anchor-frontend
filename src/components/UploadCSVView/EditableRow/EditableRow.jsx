import React from 'react';
import PropTypes from 'prop-types';
import { ChakraProvider, Input, Checkbox } from '@chakra-ui/react';
import './EditableRow.css';

const EditableRow = ({ editFormData, handleEditFormChange }) => {
  return (
    <ChakraProvider>
      <tr className="edit-row">
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
          <button type="submit">Save</button>
        </td>
      </tr>
    </ChakraProvider>
  );
};

EditableRow.propTypes = {
  editFormData: PropTypes.objectOf(PropTypes.object).isRequired,
  handleEditFormChange: PropTypes.func.isRequired,
};

export default EditableRow;
