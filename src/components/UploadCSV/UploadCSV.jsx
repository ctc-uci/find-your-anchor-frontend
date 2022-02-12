import React, { useState, useEffect } from 'react';
// import { Button } from '@chakra-ui/react';
import './UploadCSV.css';
import { usePapaParse } from 'react-papaparse';
import FYABackend from '../../common/utils'; // TODO: fix this when common/utils is updated

const UploadCSV = () => {
  const { readRemoteFile } = usePapaParse();
  const [CSVFile, setCSVFile] = useState();

  const [formData, setFormData] = useState({
    boxNumber: '',
    date: '',
    zipCode: '',
    boxLocation: '',
    message: '',
    picture: '',
    comments: '',
    launchedOrganically: false,
  });

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
      },
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    console.log('submit');
    readCSV(CSVFile);
  };

  return (
    <form onSubmit={e => onSubmit(e)}>
      <input
        type="file"
        name="myFile"
        accept=".csv"
        onChange={e => setCSVFile(e.target.files[0])}
      />
      <button type="submit" value="Submit">
        Submit
      </button>
    </form>
  );
};

export default UploadCSV;
