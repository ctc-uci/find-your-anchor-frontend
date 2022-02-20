import { ChakraProvider, Input } from '@chakra-ui/react';
import { EditIcon, CheckIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
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

  const [edit, setEdit] = useState(true);

  return (
    <ChakraProvider>
      <div className="csv-table">
        {/* <div className="csv-header-row">
          <th>Date</th>
          <th>Box Number</th>
          <th>Zip Code</th>
          <th>Launched Organically</th>
          <th>&nbsp;</th>
        </div> */}
        {formDatas.map(formData => {
          const id = uuidv4();
          return (
            <div key={id}>
              {edit ? (
                <div className="csv-row">
                  <p>{formData.date}</p>
                  <p>{formData.boxNumber}</p>
                  <p>{formData.zipCode}</p>
                  <p>{formData.launchedOrganically}</p>
                  <EditIcon onClick={() => setEdit(!edit)} />
                </div>
              ) : (
                <div className="csv-row">
                  <Input
                    id="boxNumber"
                    placeholder="12345"
                    name="boxNumber"
                    // value={formData.boxNumber}
                  />
                  <Input
                    id="boxNumber"
                    placeholder="12345"
                    name="boxNumber"
                    // value={formData.boxNumber}
                  />
                  <Input
                    id="boxNumber"
                    placeholder="12345"
                    name="boxNumber"
                    // value={formData.boxNumber}
                  />
                  <Input
                    id="boxNumber"
                    placeholder="12345"
                    name="boxNumber"
                    // value={formData.boxNumber}
                  />
                  <CheckIcon onClick={() => setEdit(!edit)} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ChakraProvider>
  );
};

export default UploadCSVView;
