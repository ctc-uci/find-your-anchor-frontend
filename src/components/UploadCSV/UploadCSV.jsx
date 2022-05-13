import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import countryList from 'react-select-country-list';
import PropTypes from 'prop-types';
import { FYABackend } from '../../common/utils';
import zipcodeDataDump from '../../common/zipcodeDataDump.json';

import UploadModalContent from './UploadModalContent/UploadModalContent';
import SuccessModalContent from './SuccessModalContent/SuccessModalContent';
import ErrorModalContent from './ErrorModalContent/ErrorModalContent';
import CommonModal from '../../common/CommonModal/CommonModal';
import useMobileWidth from '../../common/useMobileWidth';

import styles from './UploadCSV.module.css';
import { useCustomToast } from '../ToastProvider/ToastProvider';

const UploadCSV = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [formDatas, setFormDatas] = useState([]);
  const [CSVFile, setCSVFile] = useState(null);
  const [CSVFilename, setCSVFilename] = useState('');
  const [boxNumberMap, setBoxNumberMap] = useState(new Map());
  const [numUploadErrors, setNumUploadErrors] = useState(0);
  const [isUploadingNewFile, setIsUploadingNewFile] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useCustomToast();
  const isMobile = useMobileWidth();

  useEffect(() => {
    if (isUploadingNewFile) {
      setFormDatas([]);
    }
  }, [isUploadingNewFile]);

  const readCSV = async () => {
    const formData = new FormData();
    formData.append('file', CSVFile);
    const response = await FYABackend.post('/uploadCSV', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Response: ', response);

    const { rowData, boxNumbers, numErrors } = response.data;
    console.log('Row Data: ', rowData);
    console.log('Box Numbers: ', boxNumbers);
    console.log('Num Errors: ', numErrors);

    setFormDatas(rowData);
    setIsUploadingNewFile(false);
    setCSVFile();
    setBoxNumberMap(boxNumbers);
    setNumUploadErrors(numErrors);
    setIsLoading(false);
  };

  const onUpload = async e => {
    e.preventDefault();
    if (CSVFile) {
      setIsLoading(true);
      setCSVFilename(CSVFile.name);
      await readCSV();
    }
  };

  const onCloseModal = () => {
    setIsUploadingNewFile(true);
    onClose();
  };

  const onEditViewFile = () => {
    onClose();
    navigate('/upload-csv-view', {
      state: { rows: formDatas, boxNumberMap, filename: CSVFilename },
    });
  };

  const addToMap = async e => {
    e.preventDefault();
    try {
      // formDatas structure:
      // [
      //   {
      //     id,
      //     boxNumber,
      //     date,
      //     zipCode,
      //     country,
      //     launchedOrganically,
      //     error,
      //     latitude,
      //     longitude,
      //   }
      // ]

      // if no errors with any of the rows, set lat/long for each row
      formDatas.forEach((formData, index) => {
        const countryCode = countryList().getValue(formData.country);
        formDatas[index].country = countryCode;
        formDatas[index].latitude = zipcodeDataDump[countryCode][formData.zipCode].lat;
        formDatas[index].longitude = zipcodeDataDump[countryCode][formData.zipCode].long;
      });

      // formDatas structure:
      // [
      //   {
      //     id,
      //     boxNumber,
      //     date,
      //     zipCode,
      //     country,
      //     launchedOrganically,
      //     error,
      //     latitude,
      //     longitude,
      //   }
      // ]

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
        title: `Failed to add ${CSVFilename} to Map`,
        message: err.message,
        toastPosition: 'bottom',
        type: 'error',
      });
    }
  };

  if (isMobile && isUploadingNewFile && isOpen) {
    return <UploadModalContent setCSVFile={setCSVFile} onUpload={onUpload} />;
  }

  return (
    <CommonModal isOpen={isOpen} onClose={onCloseModal} className={styles['common-modal']}>
      <form onSubmit={addToMap}>
        {(() => {
          if (isLoading) {
            return <div className={styles['loading-text']}>Uploading...</div>;
          }
          if (isUploadingNewFile) {
            return <UploadModalContent setCSVFile={setCSVFile} onUpload={onUpload} />;
          }
          if (numUploadErrors === 0) {
            return (
              <SuccessModalContent
                setIsUploadingNewFile={setIsUploadingNewFile}
                onEditViewFile={onEditViewFile}
              />
            );
          }
          return (
            <ErrorModalContent
              CSVFileName={CSVFilename}
              setIsUploadingNewFile={setIsUploadingNewFile}
              numUploadErrors={numUploadErrors}
              onEditViewFile={onEditViewFile}
            />
          );
        })()}
      </form>
    </CommonModal>
  );
};

UploadCSV.defaultProps = {
  isOpen: true,
  onClose: () => {},
};

UploadCSV.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default UploadCSV;
