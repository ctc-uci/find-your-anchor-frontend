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

        setIsUploadingNewFile(false);
        setCSVFile();

        setFormDatas(responses);

        setIsUploadingNewFile(false);
        setCSVFile();
        setBoxNumberMap(boxNumbers);
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
    navigate('/upload-csv-view', {
      state: { rows: formDatas, boxNumberMap, filename: CSVFilename },
    });
  };

  const addToMap = async e => {
    // TODO: check if latitude and longitude are undefined for each formData
    e.preventDefault();

    try {
      // find lat/long for each formData
      const allCoordinates = await Promise.all(
        formDatas.map(async formData => getLatLong(formData.zipCode, formData.country)),
      );

      let hasError = false;
      formDatas.forEach((formData, index) => {
        if (allCoordinates[index].length === 0) {
          // TODO: display toast component if lat/long is not found for this zipcode
          // Don't know how many toasts I'd be showing here  ¯\_(ツ)_/¯
          hasError = true;
          setIsLoading(false);
        } else {
          // otherwise, set lat/long for this zipcode
          const [lat, long] = allCoordinates[index];
          formDatas[index].latitude = lat;
          formDatas[index].longitude = long;
        }
      });

      // if none of the rows have any errors
      if (!hasError) {
        await FYABackend.post('/anchorBox/boxes', formDatas);
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
        setIsLoading(false);
        navigate('/');
        showToast({
          title: `${CSVFilename} added to Map`,
          message: `Successfully added ${formDatas.length} Boxes To Map`,
          toastPosition: 'bottom-left',
          type: 'success',
        });
      }
    } catch (err) {
      showToast({
        title: `Failed to add ${CSVFilename} to Map`,
        message: err.message,
        toastPosition: 'bottom',
        type: 'error',
      });
    }
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
