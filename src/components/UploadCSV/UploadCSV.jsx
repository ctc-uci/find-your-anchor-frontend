import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { usePapaParse } from 'react-papaparse';
import PropTypes from 'prop-types';
import { FYABackend } from '../../common/utils';

import UploadModalContent from './UploadModalContent/UploadModalContent';
import SuccessModalContent from './SuccessModalContent/SuccessModalContent';
import ErrorModalContent from './ErrorModalContent/ErrorModalContent';
import CommonModal from '../../common/CommonModal/CommonModal';

import BoxSchema from './UploadCSVUtils';
import styles from './UploadCSV.module.css';

const UploadCSV = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { readRemoteFile } = usePapaParse();
  const [CSVFile, setCSVFile] = useState(null);
  const [CSVFilename, setCSVFilename] = useState('');
  const [formDatas, setFormDatas] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [isUploadingNewFile, setIsUploadingNewFile] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isUploadingNewFile) {
      setFormDatas([]);
      setUploadErrors([]);
      setIsLoading(true);
    }
  }, [isUploadingNewFile]);

  const checkErrors = async (CSVRow, i) => {
    try {
      await BoxSchema.validate(CSVRow, { abortEarly: false });
    } catch (err) {
      err.inner.forEach(e => {
        setUploadErrors(prevState => [...prevState, `${e.message} (line ${i})`]);
      });
    }
    setIsLoading(false);
  };

  const readCSV = () => {
    readRemoteFile(CSVFile, {
      complete: results => {
        // parse each row in csv file
        for (let i = 1; i < results.data.length; i += 1) {
          const uid = uuidv4(); // used to uniquely identify each row
          const CSVRow = {
            id: uid,
            boxNumber: results.data[i][1],
            date: results.data[i][0],
            zipCode: results.data[i][2],
            launchedOrganically: results.data[i][3].toLowerCase() === 'yes',
          };
          checkErrors(CSVRow, i);
          setFormDatas(prevState => [...prevState, CSVRow]);
        }

        setIsUploadingNewFile(false);
        setCSVFile();
      },
    });
  };

  const onUpload = e => {
    e.preventDefault();
    if (CSVFile) {
      setCSVFilename(CSVFile.name);
      readCSV();
    }
  };

  const onCloseModal = () => {
    setIsUploadingNewFile(true);
    onClose();
  };

  const onEditViewFile = () => {
    onClose();
    navigate('/upload-csv-view', { state: { rows: formDatas, filename: CSVFilename } });
  };

  const addToMap = async e => {
    e.preventDefault();
    await FYABackend.post('/boxForm/boxes', formDatas, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    onCloseModal();
    navigate('/admin');
  };

  return (
    <CommonModal isOpen={isOpen} onClose={onCloseModal} className={styles['common-modal']}>
      <form onSubmit={addToMap}>
        {(() => {
          if (isUploadingNewFile) {
            return <UploadModalContent setCSVFile={setCSVFile} onUpload={onUpload} />;
          }
          if (isLoading) {
            return <div className={styles['loading-text']}>Uploading...</div>;
          }
          if (uploadErrors.length === 0) {
            return (
              <SuccessModalContent
                CSVFileName={CSVFilename}
                setIsUploadingNewFile={setIsUploadingNewFile}
                onEditViewFile={onEditViewFile}
              />
            );
          }
          return (
            <ErrorModalContent
              CSVFileName={CSVFilename}
              setIsUploadingNewFile={setIsUploadingNewFile}
              uploadErrors={uploadErrors}
              onEditViewFile={onEditViewFile}
            />
          );
        })()}
      </form>
    </CommonModal>
  );
};

UploadCSV.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UploadCSV;
