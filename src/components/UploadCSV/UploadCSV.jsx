import React, { useState, useEffect } from 'react';
// import { Button, ChakraProvider } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import './UploadCSV.css';
import { usePapaParse } from 'react-papaparse';
import PropTypes from 'prop-types';
import FYABackend from '../../common/utils'; // TODO: fix this when common/utils is updated

import UploadModal from './UploadModal/UploadModal';
import SuccessModal from './SuccessModal/SuccessModal';
import ErrorModal from './ErrorModal/ErrorModal';

const UploadCSV = ({ closePopup }) => {
  const { readRemoteFile } = usePapaParse();
  const [CSVFile, setCSVFile] = useState();
  const [CSVFilename, setCSVFilename] = useState('');
  const [uploadErrors, setUploadErrors] = useState([]);
  const [formData, setFormData] = useState();
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [isUploadingNewFile, setIsUploadingNewFile] = useState(true);

  useEffect(async () => {
    if (formData) {
      try {
        console.log('FORMDATA:', formData);
        // send formdata to server
        await FYABackend.post('/boxForm', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (err) {
        // if box number already exists
        if (err.response.status === 400) {
          console.log('err: ', err.response.data.message);
          setUploadErrors([...uploadErrors, err.response.data.message]);
        }
      }
    }
  }, [formData]);

  const readCSV = () => {
    readRemoteFile(CSVFile, {
      complete: results => {
        console.log(results);

        // parse each line in csv file and upload each to the backend
        for (let i = 1; i < results.data.length; i += 1) {
          console.log('i:', i);
          const dateCSV = results.data[i][0];
          const boxNumberCSV = results.data[i][1];
          const zipCodeCSV = results.data[i][2];
          const launchedOrganicallyCSV = results.data[i][3].toLowerCase() === 'yes';
          // TODO: validate zipCodeCSV (wait until common/utils is updated)
          // TODO: check if any cells are empty
          // TODO: validate date?
          // TODO: check if duplicate box number
          setFormData({
            boxNumber: boxNumberCSV,
            date: dateCSV,
            zipCode: zipCodeCSV,
            boxLocation: '',
            message: '',
            picture: '',
            comments: '',
            launchedOrganically: launchedOrganicallyCSV,
          });
        }

        setIsUploadingNewFile(false);
        setCSVFile();
        setFormData();
        setIsUploadSuccess(uploadErrors.length === 0);
      },
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    if (CSVFile) {
      console.log('submit');
      setCSVFilename(CSVFile.name);
      readCSV();
    }
  };

  return (
    <ChakraProvider>
      <div className="upload-popup-box">
        <CloseIcon onClick={closePopup} className="close-popup-icon" boxSize={3} />
        {(() => {
          if (isUploadingNewFile) {
            return <UploadModal setCSVFile={setCSVFile} onSubmit={onSubmit} />;
          }
          if (isUploadSuccess) {
            return (
              <SuccessModal
                CSVFileName={CSVFilename}
                setIsUploadingNewFile={setIsUploadingNewFile}
                setIsUploadSuccess={setIsUploadSuccess}
              />
            );
          }
          return (
            <ErrorModal
              CSVFileName={CSVFilename}
              setIsUploadingNewFile={setIsUploadingNewFile}
              uploadErrors={uploadErrors}
            />
          );
        })()}
      </div>
    </ChakraProvider>
  );
};

UploadCSV.propTypes = {
  closePopup: PropTypes.func.isRequired,
};

export default UploadCSV;
