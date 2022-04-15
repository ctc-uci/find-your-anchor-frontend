/* eslint-disable prefer-object-spread */
import React, { useState, useEffect, Fragment, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Stack, Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import { useTable, usePagination } from 'react-table';

import styles from './CSVViewTable.module.css';
import ReadOnlyRow from '../ReadOnlyRow/ReadOnlyRow';
import EditableRow from '../EditableRow/EditableRow';
import { FYABackend, formatDate } from '../../../common/utils';
import BoxSchema from '../../UploadCSV/UploadCSVUtils';
import CSVViewTablePagination from './CSVViewTablePagination';

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
        Header: 'Launched Organically',
        accessor: 'launchedOrganically',
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
        launchedOrganically: rowData.values.launchedOrganically,
      };
      setEditId(rowData.original.id);
    } else {
      formValues = {
        id: rowData.id,
        date: rowData.date,
        boxNumber: rowData.boxNumber,
        zipCode: rowData.zipCode,
        launchedOrganically: rowData.launchedOrganically,
      };
      setEditId(rowData.id);
      gotoPage(Math.floor(firstErrorIndex / pageSize));
    }
    setEditFormData(formValues);
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
    const index = formDatas.findIndex(rowData => rowData.id === editId); // get index of the row that we are editing
    newFormData[index] = editedRow; // update the array at index
    setFormData(newFormData);
    gotoPage(pageIndex);
    setEditId(null);
    setCsvErrors(csvErrors.filter(error => error !== editId)); // delete edited row from csvErrors array
  };

  const handleDeleteRow = rowId => {
    setFormData(formDatas.filter(rowData => rowData.id !== rowId));
    setDeleted(!deleted);
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

    // find the index of the first row that has an error
    const firstErrorIndex = errors.findIndex(error => error !== 'success');

    setIsLoading(false);

    // if there is a row that has an error
    if (firstErrorIndex !== -1) {
      editRow(e, errors[firstErrorIndex], firstErrorIndex, false);
    } else {
      await FYABackend.post('/anchorBox/boxes', formDatas);
      navigate('/');
    }
  };

  // check if any rows have an error when page first loads
  useEffect(async () => {
    const errors = await checkErrors(formDatas);
    addErrors(errors);
  }, []);

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
            {page.map(rowData => {
              prepareRow(rowData);
              return (
                <Fragment key={rowData.original.id}>
                  {editId === rowData.original.id ? (
                    <EditableRow
                      editFormData={editFormData}
                      handleEditFormSubmit={handleEditFormSubmit}
                      isError={csvErrors.includes(rowData.original.id)}
                    />
                  ) : (
                    <ReadOnlyRow
                      data={rowData}
                      editRow={editRow}
                      handleDeleteRow={handleDeleteRow}
                      isError={csvErrors.includes(rowData.original.id)}
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
