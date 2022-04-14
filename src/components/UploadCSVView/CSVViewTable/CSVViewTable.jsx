/* eslint-disable prefer-object-spread */
import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Stack, Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import styles from './CSVViewTable.module.css';
import ReadOnlyRow from '../ReadOnlyRow/ReadOnlyRow';
import EditableRow from '../EditableRow/EditableRow';
import { FYABackend, formatDate, getLatLong } from '../../../common/utils';
import BoxSchema from '../../UploadCSV/UploadCSVUtils';

const CSVViewTable = ({ rows, boxNumberMap }) => {
  console.log(boxNumberMap && boxNumberMap);
  const navigate = useNavigate();
  const [csvErrors, setCsvErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formDatas, setFormData] = useState(rows);
  const [boxNumbers] = useState(boxNumberMap);
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    date: '',
    boxNumber: '',
    zipCode: '',
    country: '',
    launchedOrganically: false,
  });

  const editRow = (e, data) => {
    e.preventDefault();
    // store current form values for row
    const formValues = {
      date: data.date,
      boxNumber: data.boxNumber,
      zipCode: data.zipCode,
      country: data.country,
      launchedOrganically: data.launchedOrganically,
    };
    setEditFormData(formValues);
    setEditId(data.id);
  };

  const updateBoxNumberMap = (oldBoxNum, lineNum, newBoxNum) => {
    boxNumbers.get(oldBoxNum).delete(lineNum);

    if (boxNumbers.get(oldBoxNum).size === 0) {
      boxNumbers.delete(oldBoxNum);
    }

    if (!boxNumbers.has(newBoxNum)) {
      boxNumbers.set(newBoxNum, new Set());
    }
    // TODO: need to convert newBoxNum to string
    boxNumbers.get(newBoxNum).add(lineNum);
  };

  const handleEditFormSubmit = editRowData => {
    const editedRow = {
      id: editId,
      date: formatDate(editRowData.date),
      boxNumber: editRowData.boxNumber,
      zipCode: editRowData.zipCode,
      country: editRowData.country,
      launchedOrganically: editRowData.launchedOrganically,
    };

    const index = formDatas.findIndex(data => data.id === editId); // get index of the row that we are editing
    updateBoxNumberMap(formDatas[index].boxNumber, index, editRowData.boxNumber);
    formDatas[index] = editedRow;
    console.log(boxNumberMap);
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
    setCsvErrors(errors.filter(error => error !== 'success').map(err => err.id));
  };

  const addToMap = async e => {
    e.preventDefault();
    setIsLoading(true);
    const errors = await checkErrors(formDatas);
    addErrors(errors);
    const nextError = errors.find(error => error !== 'success');

    if (nextError) {
      editRow(e, nextError);
      setIsLoading(false);
    } else {
      // find and set latitude and longitude for each formData
      try {
        await Promise.allSettled(
          formDatas.map(async (formData, index) => {
            const [lat, long] = await getLatLong(formData.zipCode, formData.country);
            formDatas[index].latitude = lat;
            formDatas[index].longitude = long;
            formDatas[index].showOnMap = true;
          }),
        );

        // formDatas.forEach(formData => {
        //   if (formData.latitude === undefined && formData.longitude === undefined) {
        //     console.log('formData: ', formData);
        //     editRow(e, formData);
        //   }
        // });

        console.log(formDatas);
        await FYABackend.post('/anchorBox/boxes', formDatas);
        setIsLoading(false);
        navigate('/admin');
      } catch (err) {
        console.log(err);
      }
    }
  };

  // check if any rows have an error when page first loads
  useEffect(async () => {
    setIsLoading(true);
    setFormData(rows);
    const errors = await checkErrors(rows);
    addErrors(errors);
    setIsLoading(false);
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
              <Th>Country</Th>
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
  boxNumberMap: PropTypes.instanceOf(Map).isRequired,
};

export default CSVViewTable;
