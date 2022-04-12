/* eslint-disable prefer-object-spread */
import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Stack, Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import styles from './CSVViewTable.module.css';
import ReadOnlyRow from '../ReadOnlyRow/ReadOnlyRow';
import EditableRow from '../EditableRow/EditableRow';
import { FYABackend, formatDate } from '../../../common/utils';
import BoxSchema from '../../UploadCSV/UploadCSVUtils';

const CSVViewTable = ({ rows }) => {
  const navigate = useNavigate();
  const [csvErrors, setCsvErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
    // store current form values for row
    const formValues = {
      date: data.date,
      boxNumber: data.boxNumber,
      zipCode: data.zipCode,
      launchedOrganically: data.launchedOrganically,
    };
    setEditFormData(formValues);
    setEditId(data.id);
  };

  const handleEditFormSubmit = editRowData => {
    const editedRow = {
      id: editId,
      date: formatDate(editRowData.date),
      boxNumber: editRowData.boxNumber,
      zipCode: editRowData.zipCode,
      launchedOrganically: editRowData.launchedOrganically,
    };

    const newFormData = [...formDatas];
    const index = formDatas.findIndex(data => data.id === editId); // get index of the row that we are editing
    newFormData[index] = editedRow; // update the array at index
    setFormData(newFormData);
    setEditId(null);
    setCsvErrors(csvErrors.filter(error => error !== editId)); // delete edited row from csvErrors array
  };

  const handleDeleteRow = rowId => {
    setFormData(formDatas.filter(data => data.id !== rowId));
  };

  const checkErrors = async CSVRows => {
    return Promise.all(
      CSVRows.map(async CSVRow => {
        try {
          await BoxSchema.validate(CSVRow);
          return 'success';
        } catch (err) {
          return CSVRow;
        }
      }),
    );
  };

  const addErrors = errors => {
    errors.forEach(error => {
      if (error !== 'success') {
        setCsvErrors(prevState => [...prevState, error.id]);
      }
    });
  };

  const addToMap = async e => {
    e.preventDefault();
    setIsLoading(true);
    const errors = await checkErrors(formDatas);
    addErrors(errors);
    const nextError = errors.find(error => error !== 'success');
    setIsLoading(false);
    if (nextError) {
      editRow(e, nextError);
    } else {
      await FYABackend.post('/anchorBox/boxes', formDatas);

      navigate(`/admin`);
    }
  };

  // check if any rows have an error when page first loads
  useEffect(async () => {
    setFormData(rows);
    const errors = await checkErrors(rows);
    addErrors(errors);
  }, [rows]);

  return (
    <form onSubmit={addToMap} className={styles['csv-table-form']}>
      <div className={`${styles['csv-table-container']} ${styles['scrollable-div']}`}>
        <Table className={styles['csv-table']}>
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Box Number</Th>
              <Th>Zip Code</Th>
              <Th>Launched Organically</Th>
              <Th>&nbsp;</Th>
            </Tr>
          </Thead>
          <Tbody>
            {formDatas.map(data => {
              return (
                <Fragment key={data.id}>
                  {editId === data.id ? (
                    <EditableRow
                      editFormData={editFormData}
                      handleEditFormSubmit={handleEditFormSubmit}
                      isError={csvErrors.includes(data.id)}
                    />
                  ) : (
                    <ReadOnlyRow
                      data={data}
                      editRow={editRow}
                      handleDeleteRow={handleDeleteRow}
                      isError={csvErrors.includes(data.id)}
                    />
                  )}
                </Fragment>
              );
            })}
          </Tbody>
        </Table>
      </div>
      <Stack direction="row" justify="right" marginTop="25px">
        <Button isLoading={isLoading} type="submit" colorScheme="teal">
          Add to Map
        </Button>
      </Stack>
    </form>
  );
};

CSVViewTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])).isRequired,
};

export default CSVViewTable;
