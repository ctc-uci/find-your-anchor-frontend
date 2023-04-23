import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FYABackend } from '../../common/utils';

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

    try {
      const response = await FYABackend.post('/uploadCSV', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { rowData, boxNumbers, numErrors } = response.data;

      setFormDatas(rowData);
      setBoxNumberMap(boxNumbers);
      setNumUploadErrors(numErrors);
    } catch (err) {
      showToast({
        title: `Failed to upload ${CSVFilename}`,
        message: err.message,
        toastPosition: 'bottom',
        type: 'error',
      });
    }

    setIsUploadingNewFile(false);
    setCSVFile();
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
    setIsLoading(true);
    try {
      // if no errors with any of the rows, upload all boxes
      const start = new Date();
      await FYABackend.post('/anchorBox/boxes', formDatas);
      await FYABackend.post('/boxHistory/boxes', formDatas);
      console.log('Total time took at least ', new Date() - start, 'ms');
      setIsLoading(false);
      navigate('/');
      onCloseModal();
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
          if (isUploadingNewFile && isLoading) {
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
                isLoading={isLoading}
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
