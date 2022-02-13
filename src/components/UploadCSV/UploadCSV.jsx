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

const UploadCSV = ({ closePopup }) => {
  const { readRemoteFile } = usePapaParse();
  const [CSVFile, setCSVFile] = useState();
  const [formData, setFormData] = useState();
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [isUploadingNewFile, setIsUploadingNewFile] = useState(true);
  // const isUploadNew = true;

  useEffect(async () => {
    if (formData) {
      console.log('FORMDATA:', formData);
      // send formdata to server
      await FYABackend.post('/boxForm', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
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
        setIsUploadSuccess(true);
        setIsUploadingNewFile(false);
        setCSVFile();
        setFormData();
      },
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    if (CSVFile) {
      console.log('submit');
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
                CSVFileName={CSVFile ? CSVFile.name : 'patch1.csv'}
                setIsUploadingNewFile={setIsUploadingNewFile}
                setIsUploadSuccess={setIsUploadSuccess}
              />
            );
          }
          return <h2>There was no result!</h2>;
        })()}
      </div>
    </ChakraProvider>
  );
};

UploadCSV.propTypes = {
  closePopup: PropTypes.func.isRequired,
};

export default UploadCSV;
