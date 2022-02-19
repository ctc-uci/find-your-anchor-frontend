import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import './UploadCSVView.css';

const UploadCSVView = () => {
  const formDatas = [
    {
      date: '09/28/2022',
      boxNumber: '123',
      zipCode: '13252',
      launchedOrganically: 'yes',
    },
    {
      date: '09/28/2022',
      boxNumber: '123',
      zipCode: '13252',
      launchedOrganically: 'yes',
    },
  ];

  return (
    <ChakraProvider>
      <div>
        {formDatas.map(formData => {
          const id = uuidv4();
          return (
            <div key={id} className="csv-row">
              <p>{formData.date}</p>
              <p>{formData.boxNumber}</p>
              <p>{formData.zipCode}</p>
              <p>{formData.launchedOrganically}</p>
            </div>
          );
        })}
      </div>
    </ChakraProvider>
  );
};

export default UploadCSVView;
