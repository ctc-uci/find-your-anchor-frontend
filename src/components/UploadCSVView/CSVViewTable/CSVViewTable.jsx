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
import { FYABackend, formatDate, getLatLong } from '../../../common/utils';
import BoxSchema from '../../UploadCSV/UploadCSVUtils';
import CSVViewTablePagination from './CSVViewTablePagination';
import useMobileWidth from '../../../common/useMobileWidth';

const CSVViewTable = ({ rows, boxNumberMap }) => {
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

  const updateBoxNumberMap = (oldBoxNum, lineNum, newBoxNum) => {
    // if either oldBoxNum or newBoxNum is empty
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

  const checkErrors = async CSVRow => {
    try {
      // the context allows us to pass extra arguments to yup validation
      // passing boxNumbers so yup validation can use this to check if there's a duplicate box number
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
      <Stack direction="row" justify="right" marginTop="-25px" marginBottom="25px">
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
            {page.map((rowData, index) => {
              prepareRow(rowData);
              // console.log('Edit Row: ', editFormData);
              // console.log('Read Row: ', rowData);
              return (
                <AccordionItem key={rowData.original.id} borderWidth="1px">
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
                            lineNumber={pageIndex * 10 + index + 1}
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
};

export default CSVViewTable;
