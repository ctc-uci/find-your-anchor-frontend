import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Table, Tbody, Thead, Th, Tr, Text } from '@chakra-ui/react';
import { useTable, usePagination } from 'react-table';

import styles from './CSVPreview.module.css';
import ExportCSVRow from '../ExportCSVRow/ExportCSVRow';
import renameProperty from '../ExportCSVUtils';
import TablePagination from '../../../common/TablePagination/TablePagination';

// this component is used for Export CSV
const CSVPreview = ({ formValues, selectedPageSize }) => {
  const columns = useMemo(
    () =>
      Object.keys(formValues[0]).map(property => {
        return { Header: renameProperty(property), accessor: property };
      }),
    [],
  );

  const data = useMemo(() => formValues, [formValues]);

  const {
    prepareRow,
    headerGroups,
    page,
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

  // this is used to set the number of rows to display per page
  useEffect(() => {
    setPageSize(selectedPageSize);
  }, [selectedPageSize]);

  return (
    <div className={styles['csv-preview']}>
      <Text className={styles['csv-preview-title']}>CSV Preview</Text>
      <div className={`${styles['csv-preview-wrapper']} ${styles['scrollable-div']}`}>
        {formValues.length > 0 && (
          <Table className={styles['csv-preview']}>
            <Thead>
              <Tr {...headerGroups[0].getHeaderGroupProps()}>
                {/* eslint-disable react/no-array-index-key */}
                {headerGroups[0].headers.map((column, index) => (
                  <Th key={index} {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {page.map(rowData => {
                prepareRow(rowData);
                return <ExportCSVRow key={rowData.values.box_id} data={rowData.values} />;
              })}
            </Tbody>
          </Table>
        )}
      </div>
      <TablePagination
        pageLength={pageOptions.length}
        pageIndex={pageIndex}
        pageCount={pageCount}
        pageSize={pageSize}
        pageControl={{
          gotoPage,
          nextPage,
          previousPage,
          canNextPage,
          canPreviousPage,
        }}
      />
    </div>
  );
};

CSVPreview.propTypes = {
  formValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])).isRequired,
  selectedPageSize: PropTypes.number.isRequired,
};

export default CSVPreview;
