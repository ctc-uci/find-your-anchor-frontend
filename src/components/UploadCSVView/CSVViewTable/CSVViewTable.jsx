/* eslint-disable prefer-object-spread */
import React, { useState, useEffect, Fragment, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Stack, Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import { useTable, usePagination } from 'react-table';

import styles from './CSVViewTable.module.css';
import ReadOnlyRow from '../ReadOnlyRow/ReadOnlyRow';
import EditableRow from '../EditableRow/EditableRow';
import { FYABackend, formatDate, getLatLong } from '../../../common/utils';
import BoxSchema from '../../UploadCSV/UploadCSVUtils';
import CSVViewTablePagination from './CSVViewTablePagination';

const CSVViewTable = ({ rows, boxNumberMap }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formDatas, setFormDatas] = useState(rows);
  const [boxNumbers] = useState(boxNumberMap);
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    date: '',
    boxNumber: '',
    zipCode: '',
    country: '',
    launchedOrganically: false,
  });

  const [currentPage, setCurrentPage] = useState(null);
  const [deleted, setDeleted] = useState(false);

  const columns = useMemo(
    () => [
      {
        Header: 'Box No',
        accessor: 'boxNumber',
      },
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Zip Code',
        accessor: 'zipCode',
      },
      {
        Header: 'Country',
        accessor: 'country',
      },
      {
        Header: 'Launched Organically',
        accessor: 'launchedOrganically',
      },
      {
        Header: 'Error',
        accessor: 'error',
      },
    ],
    [],
  );

  const data = useMemo(() => formDatas, [formDatas]);

  const {
    // getTableProps,
    // getTableBodyProps,
    // headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination,
  );

  useEffect(() => {
    setCurrentPage(pageIndex);
  }, [pageIndex]);

  useEffect(() => {
    if (currentPage) {
      gotoPage(currentPage);
    }
  }, [deleted]);

  // manual = editing the row by hand (not from addToMap)
  const editRow = (e, rowData, firstErrorIndex, manual) => {
    e.preventDefault();
    // store current form values for row so that EditableRow
    // can display these values when it first renders
    let formValues = {};
    if (manual) {
      formValues = {
        id: rowData.original.id,
        date: rowData.values.date,
        boxNumber: rowData.values.boxNumber,
        zipCode: rowData.values.zipCode,
        country: rowData.values.country,
        launchedOrganically: rowData.values.launchedOrganically,
      };
      setEditFormData(formValues);
      setEditId(rowData.original.id);
    } else {
      formValues = {
        id: rowData.id,
        date: rowData.date,
        boxNumber: rowData.boxNumber,
        zipCode: rowData.zipCode,
        country: rowData.country,
        launchedOrganically: rowData.launchedOrganically,
      };
      setEditFormData(formValues);
      setEditId(rowData.id);
      gotoPage(Math.floor(firstErrorIndex / pageSize));
    }
  };

  const updateBoxNumberMap = (oldBoxNum, lineNum, newBoxNum) => {
    if (oldBoxNum === 0 || newBoxNum === 0) {
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

    // cannot do formDatas[index] = editedRow becuase that will not update the page
    const newFormDatas = [...formDatas]; // update formDatas with the edited row
    const index = formDatas.findIndex(rowData => rowData.id === editId); // get index of the row that we are editing
    newFormDatas[index] = editedRow; // update the array at index
    setFormDatas(newFormDatas);

    gotoPage(pageIndex);
    setEditId(null);
  };

  const handleDeleteRow = rowId => {
    setFormDatas(formDatas.filter(rowData => rowData.id !== rowId));
    setDeleted(!deleted);
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
    const firstErrorRowIndex = processedRows.findIndex(row => row.error);

    if (firstErrorRowIndex !== -1) {
      setIsLoading(false);
      editRow(e, processedRows[firstErrorRowIndex], firstErrorRowIndex, false);
    } else {
      try {
        // find lat/long for each formData
        const allCoordinates = await Promise.all(
          formDatas.map(async formData => getLatLong(formData.zipCode, formData.country)),
        );

        let hasError = false;
        formDatas.forEach((formData, index) => {
          if (allCoordinates[index].length === 0) {
            // if lat/long is not found for this zipcode
            console.log('cannot find latitude for formData: ', formData);
            hasError = true;
            setIsLoading(false);
            editRow(e, formData, index, false);
          } else {
            // otherwise, set lat/long for this zipcode
            const [lat, long] = allCoordinates[index];
            formDatas[index].latitude = lat;
            formDatas[index].longitude = long;
          }
        });

        // set lat/long for each formData
        // formDatas.forEach((formData, index) => {
        //   const [lat, long] = allCoordinates[index];
        //   formDatas[index].latitude = lat;
        //   formDatas[index].longitude = long;
        // });

        // if none of the rows have any errors
        if (!hasError) {
          await FYABackend.post('/anchorBox/boxes', formDatas);
          setIsLoading(false);
          navigate('/admin');
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <form onSubmit={addToMap} className={styles['csv-table-form']}>
      <Stack direction="row" justify="right" marginTop="25px" marginBottom="25px">
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSizeVal => (
            <option key={pageSizeVal} value={pageSizeVal}>
              Show {pageSizeVal}
            </option>
          ))}
        </select>
        <Button isLoading={isLoading} type="submit" colorScheme="teal">
          Add to Map
        </Button>
      </Stack>
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
            {page.map((rowData, index) => {
              prepareRow(rowData);
              return (
                <Fragment key={rowData.original.id}>
                  {editId === rowData.original.id ? (
                    <EditableRow
                      editFormData={editFormData}
                      handleEditFormSubmit={handleEditFormSubmit}
                      isError={rowData.values.error}
                      boxNumberMap={boxNumbers}
                      updateBoxNumberMap={updateBoxNumberMap}
                      lineNumber={pageIndex * 10 + index + 1}
                    />
                  ) : (
                    <ReadOnlyRow
                      data={rowData}
                      editRow={editRow}
                      handleDeleteRow={handleDeleteRow}
                      isError={rowData.values.error}
                    />
                  )}
                </Fragment>
              );
            })}
          </Tbody>
        </Table>
      </div>
      <CSVViewTablePagination
        pageLength={pageOptions.length}
        pageIndex={pageIndex}
        pageCount={pageCount}
        pageSize={pageSize}
        pageControl={{
          setPageSize,
          gotoPage,
          nextPage,
          previousPage,
          canNextPage,
          canPreviousPage,
        }}
      />
    </form>
  );
};

CSVViewTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])).isRequired,
  boxNumberMap: PropTypes.instanceOf(Map).isRequired,
};

export default CSVViewTable;
