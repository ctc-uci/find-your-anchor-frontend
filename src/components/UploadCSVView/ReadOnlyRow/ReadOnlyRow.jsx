import React from 'react';
import PropTypes from 'prop-types';
import './ReadOnlyRow.css';
import EditIcon from '../../../assets/edit.png';
import DeleteIcon from '../../../assets/delete.png';
import GreenCheckIcon from '../../../assets/green-check.png';
import RedCrossIcon from '../../../assets/red-x.png';

const ReadOnlyRow = ({ data, editRow, handleDeleteClick }) => {
  return (
    <tr key={data.id}>
      <td>{data.date}</td>
      <td>{data.boxNumber}</td>
      <td>{data.zipCode}</td>
      <td>
        {data.launchedOrganically ? (
          <img src={GreenCheckIcon} alt="Green Check Icon" className="green-check-icon" />
        ) : (
          <img src={RedCrossIcon} alt="Red Cross Icon" className="red-cross-icon" />
        )}
      </td>
      <td>
        <button type="button" onClick={() => handleDeleteClick(data.id)}>
          <img src={DeleteIcon} alt="Edit Icon" className="delete-icon" />
        </button>
        <button type="button" onClick={e => editRow(e, data)}>
          <img src={EditIcon} alt="Edit Icon" className="edit-icon" />
        </button>
      </td>
    </tr>
  );
};

ReadOnlyRow.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    date: PropTypes.string,
    boxNumber: PropTypes.string,
    zipCode: PropTypes.string,
    launchedOrganically: PropTypes.bool,
  }).isRequired,
  editRow: PropTypes.func.isRequired,
  handleDeleteClick: PropTypes.func.isRequired,
};

export default ReadOnlyRow;
