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
  const [formDatas, setFormDatas] = useState([]);
  const [isUploadingNewFile, setIsUploadingNewFile] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(async () => {
  //   if (formData) {
  //     try {
  //       console.log('FORMDATA:', formData);
  //       await FYABackend.post('/boxForm', formData, {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });
  //     } catch (err) {
  //       // if box number already exists
  //       if (err.response.status === 400) {
  //         setUploadErrors(prevState => [...prevState, err.response.data.message]);
  //       }
  //     }
  //     setIsLoading(false);
  //   }
  // }, [formData]);

  useEffect(() => {
    if (isUploadingNewFile) {
      setUploadErrors([]);
      setIsLoading(true);
    }
  }, [isUploadingNewFile]);

  const checkEmptyCells = async (
    line,
    dateCSV,
    boxNumberCSV,
    zipCodeCSV,
    launchedOrganicallyCSV,
  ) => {
    const emptyCells = [];
    if (!dateCSV) {
      emptyCells.push('date');
    }
    if (!boxNumberCSV) {
      emptyCells.push('box number');
    } else {
      const res = await FYABackend.get('/boxForm/exists', boxNumberCSV);
      console.log(res.data);
      if (res.data) {
        console.log('BOX NUMBER EXISTS');
        setUploadErrors(prevState => [...prevState, `box number ${boxNumberCSV} already exists`]);
      }
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
    // if (emptyCells.length > 0) setIsLoading(false);
    setIsLoading(false);
  };

  const readCSV = () => {
    readRemoteFile(CSVFile, {
      complete: results => {
        // parse each line in csv file and upload each to the backend
        console.log(results.data);
        for (let i = 1; i < results.data.length; i += 1) {
          const dateCSV = results.data[i][0];
          const boxNumberCSV = results.data[i][1];
          const zipCodeCSV = results.data[i][2];
          const launchedOrganicallyCSV = results.data[i][3];
          // TODO: check if any cells are empty
          checkEmptyCells(i, dateCSV, boxNumberCSV, zipCodeCSV, launchedOrganicallyCSV);
          // checkErrors(results.data[i], i);
          // TODO: validate zipCodeCSV (wait until common/utils is updated)
          // TODO: validate date?
          // TODO: validate box number is type integer
          setFormDatas(prevState => [
            ...prevState,
            {
              boxNumber: boxNumberCSV,
              date: dateCSV,
              zipCode: zipCodeCSV,
              boxLocation: '',
              message: '',
              picture: '',
              comments: '',
              launchedOrganically: launchedOrganicallyCSV.toLowerCase() === 'yes',
            },
          ]);
        }

        setIsUploadingNewFile(false);
        setCSVFile();
        // setFormData();
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

  const addToMap = async e => {
    e.preventDefault();
    console.log('ADD TO MAP');
    return Promise.all(
      formDatas.map(async formData => {
        console.log('FORMDATA: ', formData);
        await FYABackend.post('/boxForm', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }),
    );
  };

  return (
    <CommonModal isOpen={isOpen} onClose={onClose} className="common-modal">
      <form onSubmit={addToMap}>
        {(() => {
          if (isUploadingNewFile) {
            return <UploadModal setCSVFile={setCSVFile} onUpload={onUpload} />;
          }
          if (isLoading) {
            return <div className="loading-text">Uploading...</div>;
          }
          if (uploadErrors.length === 0) {
            return (
              <SuccessModal
                CSVFileName={CSVFilename}
                setIsUploadingNewFile={setIsUploadingNewFile}
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
      </form>
    </CommonModal>
  );
};

UploadCSV.propTypes = {
  isOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UploadCSV;
