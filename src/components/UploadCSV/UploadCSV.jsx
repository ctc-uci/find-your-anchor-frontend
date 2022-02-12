import React, { useState } from 'react';
// import { Button } from '@chakra-ui/react';
import './UploadCSV.css';
import { usePapaParse } from 'react-papaparse';

const UploadCSV = () => {
  const { readRemoteFile } = usePapaParse();
  const [CSVFile, setCSVFile] = useState();
  // const [CSVArray, setCSVArray] = useState([]);
  // [{name: "", age: 0, rank: ""},{name: "", age: 0, rank: ""}]

  const uploadFile = () => {
    readRemoteFile(CSVFile, {
      complete: results => {
        console.log('---------');
        console.log(results.data);
        console.log('---------');
      },
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    console.log('submit');
    uploadFile(CSVFile);
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
