import React, { useState } from 'react';
import { ChakraProvider, Button, Text, Stack, useDisclosure } from '@chakra-ui/react';
import { CSVLink } from 'react-csv';
import { useLocation } from 'react-router-dom';
import renameProperty from '../../components/ExportCSV/ExportCSVUtils';
import CSVPreview from '../../components/ExportCSV/CSVPreview/CSVPreview';

import styles from '../ExportCSV/ExportCSV.module.css';
import ExportSuccessModal from '../../components/ExportCSV/ExportSuccessModal/ExportSuccessModal';

const CSVPreviewPage = () => {
  const { state } = useLocation();
  const [pageSize, setPageSize] = useState(10); // default number of rows per page is 10

  const {
    isOpen: isUploadCSVOpenModal,
    onOpen: onUploadCSVOpenModal,
    onClose: onCloseUploadCSVOpenModal,
  } = useDisclosure();

  const csvReport = {
    data: state.rows,
    headers: Object.keys(state.rows[0]).map(property => ({
      label: renameProperty(property),
      key: property,
    })),
    filename: 'FYA-CSV.csv',
    onClick: () => onUploadCSVOpenModal(),
  };

  return (
    <ChakraProvider>
      <div className={styles['export-csv-wrapper']}>
        <div className={styles['export-csv-header']}>
          <div className={styles['header-text']}>
            <Text fontSize="3xl" className={styles['header-title']}>
              Export CSV
            </Text>
            <Text fontSize="lg">{state.rows.length} boxes</Text>
          </div>

          <Stack direction="row" justify="right" marginTop="-40px" marginBottom="25px" gap="15px">
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
            <Button className={styles['header-button']}>
              <CSVLink {...csvReport}>Export to CSV</CSVLink>
            </Button>
          </Stack>
        </div>
        <div className={styles['export-csv-content']}>
          <CSVPreview formValues={state.rows} selectedPageSize={pageSize} />
        </div>
        <ExportSuccessModal isOpen={isUploadCSVOpenModal} onClose={onCloseUploadCSVOpenModal} />
      </div>
    </ChakraProvider>
  );
};

export default CSVPreviewPage;
