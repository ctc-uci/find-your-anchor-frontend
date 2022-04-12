import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { usePapaParse } from 'react-papaparse';
import PropTypes from 'prop-types';
import { FYABackend, getLatLong } from '../../common/utils';

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isUploadingNewFile) {
      setFormDatas([]);
      setUploadErrors([]);
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
  };

  const readCSV = () => {
    readRemoteFile(CSVFile, {
      header: true,
      complete: async results => {
        const CSVRows = [];
        const boxNumbers = new Map();

        // parse each row in csv file
        await Promise.all(
          results.data.map(async (row, i) => {
            const uid = uuidv4(); // generates am id to uniquely identify each row
            const CSVRow = {
              id: uid,
              boxNumber: row['Box No'],
              date: row.Date,
              zipCode: row['Zip Code'],
              country: row.Country,
              launchedOrganically: row['Launched Organically?'].toLowerCase() === 'yes',
            };
            await checkErrors(CSVRow, i + 1);
            CSVRows.push(CSVRow);
            const boxNumber = row['Box No'];
            if (boxNumbers.has(boxNumber)) {
              boxNumbers.get(boxNumber).push(i + 1);
            } else {
              boxNumbers.set(boxNumber, [i + 1]);
            }
          }),
        );

        setFormDatas(CSVRows);

        // check if there are duplicate box numbers in the same file
        boxNumbers.forEach((lineNumbers, boxNumber) => {
          if (lineNumbers.length > 1) {
            setUploadErrors(prevState => [
              ...prevState,
              `Duplicate box number: ${boxNumber} (lines ${lineNumbers.join(', ')})`,
            ]);
          }
        });

        setIsUploadingNewFile(false);
        setCSVFile();
        setIsLoading(false);
      },
    });
  };

  const onUpload = e => {
    e.preventDefault();
    if (CSVFile) {
      setIsLoading(true);
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

    // find and set latitude and longitude for each formData
    await Promise.allSettled(
      formDatas.map(async (formData, index) => {
        const [lat, long] = await getLatLong(formData.zipCode, formData.country);
        formDatas[index].latitude = lat;
        formDatas[index].longitude = long;
        formDatas[index].showOnMap = true;
      }),
    );

    await FYABackend.post('/anchorBox/boxes', formDatas);
    onCloseModal();
    navigate('/');
  };

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
