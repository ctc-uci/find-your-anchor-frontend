import React from 'react';
import PropTypes from 'prop-types';
import { Td, Tr, useDisclosure } from '@chakra-ui/react';
import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import DeleteBoxModal from '../DeleteBoxModal/DeleteBoxModal';
import styles from './ReadOnlyRow.module.css';

const ReadOnlyRow = ({ data, editRow, handleDeleteRow, isError }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onDelete = () => {
    handleDeleteRow(data.id);
    onClose();
  };

  return (
    <Tr key={data.id} id={data.id} className={isError && styles['csv-error']}>
      <Td>{data.date}</Td>
      <Td>{data.boxNumber}</Td>
      <Td>{data.zipCode}</Td>
      <Td>
        {data.launchedOrganically ? (
          <CheckIcon alt="Green Check Icon" className={styles['green-check-icon']} />
        ) : (
          <CloseIcon alt="Red Cross Icon" className={styles['red-cross-icon']} />
        )}
      </Td>
      <Td>
        <DeleteBoxModal isOpen={isOpen} onClose={onClose} onDelete={onDelete} />
        <button type="button" onClick={onOpen}>
          <DeleteIcon alt="Edit Icon" className={styles['delete-icon']} />
        </button>
        <button type="button" onClick={e => editRow(e, data)}>
          <EditIcon alt="Edit Icon" className={styles['edit-icon']} />
        </button>
      </Td>
    </Tr>
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
  isError: PropTypes.bool.isRequired,
};

export default ReadOnlyRow;
