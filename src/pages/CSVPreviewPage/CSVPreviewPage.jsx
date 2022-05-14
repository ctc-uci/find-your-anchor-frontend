import React from 'react';
import { ChakraProvider, Button, Text, useDisclosure } from '@chakra-ui/react';
import { CSVLink } from 'react-csv';
import { useLocation, useNavigate } from 'react-router-dom';
import renameProperty from '../../components/ExportCSV/ExportCSVUtils';
import CSVPreview from '../../components/ExportCSV/CSVPreview/CSVPreview';
import styles from '../ExportCSV/ExportCSV.module.css';
import ExportSuccessModal from '../../components/ExportCSV/ExportSuccessModal/ExportSuccessModal';
import useMobileWidth from '../../common/useMobileWidth';

const CSVPreviewPage = () => {
  const { state } = useLocation();
  const isMobile = useMobileWidth();
  const navigate = useNavigate();

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
        {!isMobile && (
          <div className={styles['export-csv-header']}>
            <div className={styles['header-text']}>
              <Text fontSize="3xl" className={styles['header-title']}>
                Export CSV
              </Text>
              <Text fontSize="lg">{state.rows.length} boxes</Text>
            </div>
            <div className={styles['button-section']}>
              <Button className={styles['header-button']}>
                <CSVLink {...csvReport}>Export to CSV</CSVLink>
              </Button>
            </div>
          </div>
        )}

        <div className={styles['export-csv-content']}>
          <CSVPreview formValues={state.rows} />
        </div>
        {isMobile && (
          <div className={styles['button-section']}>
            <Button border="1px" borderColor="#CBD5E0" bg="white" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button className={styles['header-button']}>
              <CSVLink {...csvReport}>Export</CSVLink>
            </Button>
          </div>
        )}
        <ExportSuccessModal isOpen={isUploadCSVOpenModal} onClose={onCloseUploadCSVOpenModal} />
      </div>
    </ChakraProvider>
  );
};

export default CSVPreviewPage;
