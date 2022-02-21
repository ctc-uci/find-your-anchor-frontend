/* eslint-disable prefer-object-spread */
import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from './CSVViewTable.module.css';
import ReadOnlyRow from '../ReadOnlyRow/ReadOnlyRow';
import EditableRow from '../EditableRow/EditableRow';

const CSVViewTable = ({ rows }) => {
  const [formDatas, setFormData] = useState(rows);
  const [editId, setEditId] = useState(null);

  const [editFormData, setEditFormData] = useState({
    date: '',
    boxNumber: '',
    zipCode: '',
    launchedOrganically: false,
  });

  const editRow = (e, data) => {
    e.preventDefault();
    setEditId(data.id);

    const formValues = {
      date: data.date,
      boxNumber: data.boxNumber,
      zipCode: data.zipCode,
      launchedOrganically: data.launchedOrganically,
    };

    setEditFormData(formValues);
  };

  const handleEditFormChange = e => {
    e.preventDefault();
    setEditFormData(Object.assign({}, editFormData, { [e.target.name]: e.target.value }));
  };

  const handleEditFormSubmit = e => {
    e.preventDefault();
    const editedRow = {
      id: editId,
      date: editFormData.date,
      boxNumber: editFormData.boxNumber,
      zipCode: editFormData.zipCode,
      launchedOrganically: editFormData.launchedOrganically,
    };

    const newFormData = [...formDatas];
    const index = formDatas.findIndex(data => data.id === editId); // get index of the row that we are editing
    newFormData[index] = editedRow; // update the array at index
    setEditId(null);
    setFormData(newFormData);
  };

  const handleDeleteClick = rowId => {
    const newFormData = [...formDatas];
    const index = formDatas.findIndex(data => data.id === rowId);
    newFormData.splice(index, 1);
    setFormData(newFormData);
  };

  return (
    <div className={`${styles['csv-table-container']} ${styles['scrollable-div']}`}>
      <form onSubmit={handleEditFormSubmit} className={styles['csv-table-form']}>
        <table className={styles['csv-table']}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Box Number</th>
              <th>Zip Code</th>
              <th>Launched Organically</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {formDatas.map(data => {
              return (
                <Fragment key={data.id}>
                  {editId === data.id ? (
                    <EditableRow
                      editFormData={editFormData}
                      handleEditFormChange={handleEditFormChange}
                    />
                  ) : (
                    <ReadOnlyRow
                      data={data}
                      editRow={editRow}
                      handleDeleteClick={handleDeleteClick}
                    />
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </form>
    </div>
  );
};

CSVViewTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])).isRequired,
};

export default CSVViewTable;
