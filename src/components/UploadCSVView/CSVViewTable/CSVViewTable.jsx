/* eslint-disable prefer-object-spread */
import React, { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Stack, Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import styles from './CSVViewTable.module.css';
import ReadOnlyRow from '../ReadOnlyRow/ReadOnlyRow';
import EditableRow from '../EditableRow/EditableRow';
import { FYABackend, formatDate, getLatLong } from '../../../common/utils';
import BoxSchema from '../../UploadCSV/UploadCSVUtils';

const CSVViewTable = ({ rows, boxNumberMap }) => {
  const navigate = useNavigate();
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
    if (Number.isNaN(oldBoxNum) || newBoxNum === 0) {
      return;
    }

    boxNumbers.get(oldBoxNum).delete(lineNum);

    if (boxNumbers.get(oldBoxNum).size === 0) {
      boxNumbers.delete(oldBoxNum);
    }

    if (!boxNumbers.has(newBoxNum)) {
      boxNumbers.set(newBoxNum, new Set());
    }

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
      error: false,
    };

    const index = formDatas.findIndex(data => data.id === editId); // get index of the row that we are editing
    formDatas[index] = editedRow;
    setEditId(null);
  };

  const handleDeleteRow = rowId => {
    setFormData(formDatas.filter(data => data.id !== rowId));
  };

  const checkErrors = async CSVRow => {
    try {
      // the context allows us to pass extra arguments (i.e. boxNumberMap) to yup validation
      await BoxSchema.validate(CSVRow, { context: boxNumbers });
      return {
        ...CSVRow,
        error: false,
      };
    } catch (err) {
      return {
        ...CSVRow,
        error: true,
      };
    }
  };

  const addToMap = async e => {
    e.preventDefault();
    setIsLoading(true);

    const processedRows = await Promise.all(formDatas.map(async formData => checkErrors(formData)));
    const firstErrorRow = processedRows.find(row => row.error);

    if (firstErrorRow) {
      editRow(e, firstErrorRow);
      setIsLoading(false);
    } else {
      // find and set latitude and longitude for each formData
      try {
        const allCoordinates = await Promise.all(
          formDatas.map(async formData => {
            getLatLong(formData.zipCode, formData.country);
          }),
        );

        formDatas.forEach((formData, index) => {
          // if lat/long is not found for this zipcode
          if (allCoordinates[index] === undefined) {
            console.log('cannot find latitude for formData: ', formData);
            editRow(e, formData);
          } else {
            const [lat, long] = allCoordinates[index];
            formDatas[index].latitude = lat;
            formDatas[index].longitude = long;
          }
        });

        console.log(formDatas);
        await FYABackend.post('/anchorBox/boxes', formDatas);
        setIsLoading(false);
        navigate('/admin');
      } catch (err) {
        console.log(err);
      }
    }
  };

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
            {formDatas.map((data, index) => {
              return (
                <Fragment key={data.id}>
                  {editId === data.id ? (
                    <EditableRow
                      editFormData={editFormData}
                      handleEditFormSubmit={handleEditFormSubmit}
                      isError={data.error}
                      boxNumberMap={boxNumbers}
                      updateBoxNumberMap={updateBoxNumberMap}
                      lineNumber={index + 1}
                    />
                  ) : (
                    <ReadOnlyRow
                      data={data}
                      editRow={editRow}
                      handleDeleteRow={handleDeleteRow}
                      isError={data.error}
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
