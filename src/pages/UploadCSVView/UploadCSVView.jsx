/* eslint-disable prefer-object-spread */

import { ChakraProvider } from '@chakra-ui/react';
// import { CheckIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
// import React from 'react';
// import { v4 as uuidv4 } from 'uuid';
import './UploadCSVView.css';
// import EditIcon from '../../assets/edit.png';
import ReadOnlyRow from '../../components/UploadCSVView/ReadOnlyRow/ReadOnlyRow';
import EditableRow from '../../components/UploadCSVView/EditableRow/EditableRow';

const UploadCSVView = () => {
  const rows = [
    {
      id: 1,
      date: '09/28/2022',
      boxNumber: '123',
      zipCode: '13252',
      launchedOrganically: 'yes',
    },
    {
      id: 2,
      date: '09/28/2022',
      boxNumber: '123',
      zipCode: '13252',
      launchedOrganically: 'yes',
    },
    {
      id: 3,
      date: '09/28/2022',
      boxNumber: '123',
      zipCode: '13252',
      launchedOrganically: 'yes',
    },
  ];

  // const [edit, setEdit] = useState(true);
  const [formDatas, setFormData] = useState(rows);
  const [editId, setEditId] = useState(null);

  const [editFormData, setEditFormData] = useState({
    date: '',
    boxNumber: '',
    zipCode: '',
    launchedOrganically: '',
  });
  // const [contacts, setContacts] = useState(formData);

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
    <ChakraProvider>
      <div className="app-container">
        <form onSubmit={handleEditFormSubmit}>
          <table className="csv-table">
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
                  <>
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
                  </>
                );
              })}
            </tbody>
          </table>
        </form>
      </div>
    </ChakraProvider>
  );
};

export default UploadCSVView;
