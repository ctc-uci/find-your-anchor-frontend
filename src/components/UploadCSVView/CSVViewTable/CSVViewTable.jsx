/* eslint-disable prefer-object-spread */
import React, { useState, useEffect, Fragment, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button,
  Box,
  Stack,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
} from '@chakra-ui/react';
import { useTable, usePagination } from 'react-table';

import styles from './CSVViewTable.module.css';
import ReadOnlyRow from '../ReadOnlyRow/ReadOnlyRow';
import EditableRow from '../EditableRow/EditableRow';
import { FYABackend, formatDate } from '../../../common/utils';
import CSVViewTablePagination from './CSVViewTablePagination';
import { useCustomToast } from '../../ToastProvider/ToastProvider';
import useMobileWidth from '../../../common/useMobileWidth';

const CSVViewTable = ({ rows, boxNumberMap, CSVFilename }) => {
  const isMobile = useMobileWidth();
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
    prepareRow,
    page, // instead of using formDatas, we'll use page, which has only the rows for the active page
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
  const { showToast } = useCustomToast();

  // manual = editing the row by clicking on the Edit Icon (not from addToMap)
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

  const updateBoxNumberMap = (oldBoxNum, newBoxNum) => {
    // if either oldBoxNum or newBoxNum is empty
    if (oldBoxNum === 0 || newBoxNum === 0) {
      return;
    }

    boxNumbers[oldBoxNum] -= 1;

    if (boxNumbers[oldBoxNum] === 0) {
      delete boxNumbers[oldBoxNum];
    }

    if (!(newBoxNum in boxNumbers)) {
      boxNumbers[newBoxNum] = 0;
    }
    boxNumbers[newBoxNum] += 1;
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

    // update formDatas with the edited row
    const newFormDatas = [...formDatas];
    const index = formDatas.findIndex(rowData => rowData.id === editId); // get index of the row that we are editing
    newFormDatas[index] = editedRow; // update the array at the index with the new edited row
    setFormDatas(newFormDatas);

    gotoPage(pageIndex);
    setEditId(null);
  };

  const handleDeleteRow = rowId => {
    setFormDatas(formDatas.filter(rowData => rowData.id !== rowId));
    setDeleted(!deleted);
  };

  const addToMap = async e => {
    e.preventDefault();
    setIsLoading(true);

    // find the first row that has an error
    const firstErrorRowIndex = formDatas.findIndex(row => row.error);

    // if an error is found in any of the rows, change the first row to EditableRow
    if (firstErrorRowIndex !== -1) {
      setIsLoading(false);
      editRow(e, formDatas[firstErrorRowIndex], firstErrorRowIndex, false);
    } else {
      try {
        // if no errors with any of the rows, upload all boxes
        await FYABackend.post('/anchorBox/boxes', formDatas);
        setIsLoading(false);
        navigate('/');
        showToast({
          title: `${CSVFilename} added to Map`,
          message: `Successfully added ${formDatas.length} Boxes To Map`,
          toastPosition: 'bottom-left',
          type: 'success',
        });
      } catch (err) {
        showToast({
          title: `Failed to add boxes to Map`,
          message: err.message || err.statusText,
          toastPosition: 'bottom',
          type: 'error',
        });
      }
    }
  };

  return (
    <form onSubmit={addToMap} className={styles['csv-table-form']}>
      <Stack direction="row" justify="right" marginTop="-40px" marginBottom="25px">
        {!isMobile && (
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
            }}
            className={styles['show-pages-select']}
          >
            {[10, 20, 30, 40, 50].map(pageSizeVal => (
              <option key={pageSizeVal} value={pageSizeVal}>
                Show {pageSizeVal}
              </option>
            ))}
          </select>
        )}
        <Button
          isLoading={isLoading}
          type="submit"
          color="white"
          bg="#345E80"
          borderRadius={isMobile ? 'xl' : 'md'}
        >
          Add to Map
        </Button>
      </Stack>
      {!isMobile && (
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
              {page.map(rowData => {
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
                        handleDeleteRow={handleDeleteRow}
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
      )}
      {isMobile && (
        <Accordion allowToggle>
          <Flex flexDirection="column" gap="20px">
            {page.map(rowData => {
              prepareRow(rowData);
              return (
                <AccordionItem
                  key={rowData.original.id}
                  borderWidth="1px"
                  borderRadius="8px"
                  borderColor={rowData.values.error && 'red'}
                >
                  {({ isExpanded }) => (
                    <>
                      <h2>
                        <AccordionButton
                          _expanded={{ bg: 'white' }}
                          onClick={() => {
                            setEditId(null);
                          }}
                        >
                          <Box flex="1" textAlign="left" fontWeight="bold">
                            {!isExpanded ? `Box #${rowData.values.boxNumber}` : ''}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        {editId === rowData.original.id ? (
                          <EditableRow
                            editFormData={editFormData}
                            handleEditFormSubmit={handleEditFormSubmit}
                            isError={rowData.values.error}
                            boxNumberMap={boxNumbers}
                            updateBoxNumberMap={updateBoxNumberMap}
                            handleDeleteRow={handleDeleteRow}
                          />
                        ) : (
                          <ReadOnlyRow
                            data={rowData}
                            editRow={editRow}
                            handleDeleteRow={handleDeleteRow}
                            isError={rowData.values.error}
                          />
                        )}
                      </AccordionPanel>
                    </>
                  )}
                </AccordionItem>
              );
            })}
          </Flex>
        </Accordion>
      )}
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
  CSVFilename: PropTypes.string.isRequired,
};

export default CSVViewTable;
