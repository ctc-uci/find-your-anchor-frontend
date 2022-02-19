import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import './UploadCSVView.css';

const UploadCSVView = () => {
  const errors = [
    {
      date: '09/28/2022',
      boxNumber: '123',
      zipCode: '13252',
      launchedOrganically: 'yes',
    },
    {
      date: '07/17/2022',
      boxNumber: '2188',
      zipCode: '23847',
      launchedOrganically: 'no',
    },
  ];

  return (
    <ChakraProvider>
      <div>
        {errors.map(error => {
          const id = uuidv4();
          return (
            <div key={id} className="csv-row">
              <p>{error.date}</p>
              <p>{error.boxNumber}</p>
              <p>{error.zipCode}</p>
              <p>{error.launchedOrganically}</p>
            </div>
          );
        })}
      </div>
    </ChakraProvider>
  );
};

export default UploadCSVView;
