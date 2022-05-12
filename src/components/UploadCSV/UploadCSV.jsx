import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import countryList from 'react-select-country-list';
import { v4 as uuidv4 } from 'uuid';
import { usePapaParse } from 'react-papaparse';
import PropTypes from 'prop-types';
import { FYABackend } from '../../common/utils';
import zipcodeDataDump from '../../common/zipcodeDataDump.json';

import UploadModalContent from './UploadModalContent/UploadModalContent';
import SuccessModalContent from './SuccessModalContent/SuccessModalContent';
import ErrorModalContent from './ErrorModalContent/ErrorModalContent';
import CommonModal from '../../common/CommonModal/CommonModal';
import useMobileWidth from '../../common/useMobileWidth';

import BoxSchema from './UploadCSVUtils';
import styles from './UploadCSV.module.css';
import { useCustomToast } from '../ToastProvider/ToastProvider';

const UploadCSV = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { readRemoteFile } = usePapaParse();
  const [formDatas, setFormDatas] = useState([]);
  const [CSVFile, setCSVFile] = useState(null);
  const [CSVFilename, setCSVFilename] = useState('');
  const [boxNumberMap, setBoxNumberMap] = useState(new Map());
  const [uploadErrors, setUploadErrors] = useState([]);
  const [isUploadingNewFile, setIsUploadingNewFile] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useCustomToast();
  const isMobile = useMobileWidth();

  useEffect(() => {
    if (isUploadingNewFile) {
      setFormDatas([]);
      setUploadErrors([]);
    }
  }, [isUploadingNewFile]);

  // checkErrors returns an array of the CSV rows with an error property
  // that indicates whether this row contains any invalid inputs
  const checkErrors = async (CSVRow, i, boxNumbers) => {
    try {
      await BoxSchema.validate(CSVRow, { abortEarly: false, context: boxNumbers });
      return {
        ...CSVRow,
        error: false,
      };
    } catch (err) {
      console.log(err);
      err.inner.forEach(e => {
        setUploadErrors(prevState => [...prevState, `${e.message} (line ${i})`]);
      });
      return {
        ...CSVRow,
        error: true,
      };
    }
  };

  const readCSV = () => {
    readRemoteFile(CSVFile, {
      header: true,
      complete: async results => {
        const boxNumbers = new Map();

        // OPTION 1: use Promise.all but can only process 1000 requests
        const responses = await Promise.all(
          results.data.map(async (row, i) => {
            const uid = uuidv4(); // generates an id to uniquely identify each row
            const boxNumber = Number(row['Box No']);
            const CSVRow = {
              id: uid,
              boxNumber,
              date: row.Date,
              zipCode: row['Zip Code'],
              country: row.Country,
              launchedOrganically: row['Launched Organically?'].toLowerCase() === 'yes',
            };

            // add boxNumber as a key to the map and
            // the value is a set of all the lines this box number shows up on
            if (!boxNumbers.has(boxNumber)) {
              boxNumbers.set(boxNumber, new Set());
            }
            boxNumbers.get(boxNumber).add(i + 1);

            // validate each row in the csv file
            return checkErrors(CSVRow, i + 1, boxNumbers);
          }),
        );

        setFormDatas(responses);
        setIsUploadingNewFile(false);
        setCSVFile();
        setBoxNumberMap(boxNumbers);
        setIsLoading(false);
      },
    });
  };

  const onUpload = async e => {
    e.preventDefault();
    if (CSVFile) {
      setIsLoading(true);
      setCSVFilename(CSVFile.name);
      readCSV();
      const formData = new FormData();
      formData.append('file', CSVFile);
      await FYABackend.post('/uploadCSV', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
          if (uploadErrors.length === 0) {
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
              uploadErrors={uploadErrors}
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
