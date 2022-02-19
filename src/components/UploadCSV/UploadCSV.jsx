import React, { useState, useEffect } from 'react';
import './UploadCSV.css';
import { usePapaParse } from 'react-papaparse';
import PropTypes from 'prop-types';
import FYABackend from '../../common/utils'; // TODO: fix this when common/utils is updated

import UploadModal from './UploadModal/UploadModal';
import SuccessModal from './SuccessModal/SuccessModal';
import ErrorModal from './ErrorModal/ErrorModal';
import CommonModal from '../../common/CommonModal/CommonModal';

const UploadCSV = ({ isOpen, onClose }) => {
  const { readRemoteFile } = usePapaParse();
  const [CSVFile, setCSVFile] = useState();
  const [CSVFilename, setCSVFilename] = useState('');
  const [uploadErrors, setUploadErrors] = useState([]);
  const [formData, setFormData] = useState();
  const [isUploadingNewFile, setIsUploadingNewFile] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
    if (formData) {
      try {
        console.log('FORMDATA:', formData);
        await FYABackend.post('/boxForm', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (err) {
        // if box number already exists
        if (err.response.status === 400) {
          setUploadErrors(prevState => [...prevState, err.response.data.message]);
        }
      }
      setIsLoading(false);
    }
  }, [formData]);

  useEffect(() => {
    if (isUploadingNewFile) {
      setUploadErrors([]);
      setIsLoading(true);
    }
  }, [isUploadingNewFile]);

  const checkEmptyCells = (line, dateCSV, boxNumberCSV, zipCodeCSV, launchedOrganicallyCSV) => {
    const emptyCells = [];
    if (!dateCSV) {
      emptyCells.push('date');
    }
    if (!boxNumberCSV) {
      emptyCells.push('box number');
    }
    if (!zipCodeCSV) {
      emptyCells.push('zip code');
    }
    if (!launchedOrganicallyCSV) {
      emptyCells.push('launched organically');
    }
    emptyCells.map(cell =>
      setUploadErrors(prevState => [...prevState, `missing ${cell} in line ${line}`]),
    );
    if (emptyCells) setIsLoading(false);
  };

  const readCSV = () => {
    readRemoteFile(CSVFile, {
      complete: results => {
        // parse each line in csv file and upload each to the backend
        for (let i = 1; i < results.data.length; i += 1) {
          const dateCSV = results.data[i][0];
          const boxNumberCSV = results.data[i][1];
          const zipCodeCSV = results.data[i][2];
          const launchedOrganicallyCSV = results.data[i][3].toLowerCase() === 'yes';
          // TODO: check if any cells are empty
          checkEmptyCells(i, dateCSV, boxNumberCSV, zipCodeCSV, launchedOrganicallyCSV);
          // TODO: validate zipCodeCSV (wait until common/utils is updated)
          // TODO: validate date?
          // TODO: validate box number is type integer
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
      },
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    if (CSVFile) {
      setCSVFilename(CSVFile.name);
      readCSV();
    }
  };

  return (
    <CommonModal isOpen={isOpen} onClose={onClose} className="common-modal">
      {(() => {
        if (isUploadingNewFile) {
          return <UploadModal setCSVFile={setCSVFile} onSubmit={onSubmit} />;
        }
        if (isLoading) {
          return <div>Uploading...</div>;
        }
        if (uploadErrors.length === 0) {
          return (
            <SuccessModal CSVFileName={CSVFilename} setIsUploadingNewFile={setIsUploadingNewFile} />
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
    </CommonModal>
  );
};

UploadCSV.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UploadCSV;
