import React from 'react';
import PropTypes from 'prop-types';
import { useDisclosure } from '@chakra-ui/react';
import './ReadOnlyRow.css';
import EditIcon from '../../../assets/edit.png';
import DeleteIcon from '../../../assets/delete.png';
import GreenCheckIcon from '../../../assets/green-check.png';
import RedCrossIcon from '../../../assets/red-x.png';
import DeleteBoxModal from '../DeleteBoxModal/DeleteBoxModal';

const ReadOnlyRow = ({ data, editRow, handleDeleteRow }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onDelete = () => {
    handleDeleteRow(data.id);
    onClose();
  };

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
        <DeleteBoxModal isOpen={isOpen} onClose={onClose} onDelete={onDelete} />
        <button type="button" onClick={onOpen}>
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
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    date: PropTypes.string,
    boxNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    zipCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    launchedOrganically: PropTypes.bool,
  }).isRequired,
  editRow: PropTypes.func.isRequired,
  handleDeleteRow: PropTypes.func.isRequired,
};

export default ReadOnlyRow;
