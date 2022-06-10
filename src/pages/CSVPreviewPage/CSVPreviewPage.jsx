import { React, useState } from 'react';
import { Button, ChakraProvider, Text } from '@chakra-ui/react';
import { CSVLink } from 'react-csv';
import { useLocation, useNavigate } from 'react-router-dom';
import renameProperty from '../../components/ExportCSV/ExportCSVUtils';
import CSVPreview from '../../components/ExportCSV/CSVPreview/CSVPreview';
import styles from '../ExportCSV/ExportCSV.module.css';
import ChakraTheme from '../../common/ChakraTheme';
import CommonConfirmationPage from '../../common/CommonConfirmationPage/CommonConfirmationPage';
import useMobileWidth from '../../common/useMobileWidth';

const CSVPreviewPage = () => {
  const { state } = useLocation();
  const isMobile = useMobileWidth();
  const navigate = useNavigate();

  const [openConfirmation, setOpenConfirmation] = useState(false);

  const csvReport = {
    data: state.rows,
    headers: Object.keys(state.rows[0]).map(property => ({
      label: renameProperty(property),
      key: property,
    })),
    filename: 'FYA-CSV.csv',
    onClick: () => setOpenConfirmation(true),
  };

  return (
    <ChakraProvider theme={ChakraTheme}>
      <div className={styles['export-csv-wrapper']}>
        {!isMobile && (
          <div className={styles['export-csv-header']}>
            <div className={styles['header-text']}>
              <Text textStyle="header-1" className={styles['header-title']}>
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
            <Button
              colorScheme="cancel"
              color="var(--color-text)"
              onClick={() => navigate('/export-csv')}
            >
              Cancel
            </Button>
            <Button colorScheme="button" className={styles['header-button']}>
              <CSVLink {...csvReport}>Export</CSVLink>
            </Button>
          </div>
        )}
        <CommonConfirmationPage
          isOpen={openConfirmation}
          confirmationTitle="Export Successful!"
          confirmationText="You CSV file is now available to view."
          isReturnHome
          showFYALogo={false}
        />
      </div>
    </ChakraProvider>
  );
};

export default CSVPreviewPage;
