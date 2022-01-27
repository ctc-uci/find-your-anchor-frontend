import React from 'react';
import { ChakraProvider, Select, Button, Input } from '@chakra-ui/react';

import './ExportCSV.css';

function ExportCSV() {
  const [sort, setSort] = React.useState('ascend');
  const [boxes, setBoxes] = React.useState('all');
  const [date, setDate] = React.useState('none');
  const [launch, setLaunch] = React.useState('both');
  const [zip, setZip] = React.useState('all');

  return (
    <ChakraProvider>
      <div className="export-csv-container">
        <div className="left-column">
          <img alt="sample" src="https://pngimg.com/uploads/box/box_PNG49.png" />
        </div>
        <div className="right-column">
          <div className="two-text-header">
            <p style={{ fontSize: '30px', fontWeight: '700' }}>Export CSV</p>
            <p style={{ fontSize: '20px' }}>30 boxes</p>
          </div>
          <div className="section">
            <p className="option-header">Sort By</p>
            <Select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="ascend">Ascending Box Number</option>
              <option value="descend">Descending Box Number</option>
            </Select>
          </div>
          <div className="section">
            <p className="option-header">Filter Options</p>
            <div className="filter-options">
              <p className="filter-names">Boxes</p>
              <div className="custom-option">
                <Select width="200px" value={boxes} onChange={e => setBoxes(e.target.value)}>
                  <option value="all">All</option>
                  <option value="custom">Custom</option>
                </Select>
                {boxes === 'custom' && <Input width="200px" placeholder="e.g. 1-9, 6, 12" />}
              </div>
            </div>
            <div className="filter-options">
              <p className="filter-names">Date</p>
              <Select width="200px" value={date} onChange={e => setDate(e.target.value)}>
                <option value="none">None</option>
                <option value="custom">Custom</option>
              </Select>
            </div>
            <div className="filter-options">
              <p className="filter-names">Launch Type</p>
              <Select width="200px" value={launch} onChange={e => setLaunch(e.target.value)}>
                <option value="both">Both</option>
                <option value="custom">Custom</option>
              </Select>
            </div>
            <div className="filter-options">
              <p className="filter-names">Zip Code</p>
              <Select width="200px" value={zip} onChange={e => setZip(e.target.value)}>
                <option value="all">All</option>
                <option value="custom">Custom</option>
              </Select>
            </div>
          </div>
          <div className="section">
            <div className="two-text-header">
              <p className="option-header">Box Details</p>
              <Button
                variant="link"
                onClick={() => {
                  const checkboxes = document.querySelectorAll("input[type = 'checkbox']");
                  checkboxes.forEach(function uncheck(checkbox) {
                    // eslint-disable-next-line no-param-reassign
                    checkbox.checked = false;
                  });
                }}
              >
                Unselect All
              </Button>
            </div>
            <div className="checkboxes">
              <div>
                <label htmlFor="cb-box-number">
                  <input type="checkbox" id="cb-box-number" defaultChecked="checked" />
                  Box Number
                </label>
                <br />
                <label htmlFor="cb-date">
                  <input type="checkbox" id="cb-date" defaultChecked="checked" />
                  Date
                </label>
                <br />
                <label htmlFor="cb-zip-code">
                  <input type="checkbox" id="cb-zip-code" defaultChecked="checked" />
                  Zip Code
                </label>
                <br />
              </div>
              <div>
                <label htmlFor="cb-landmark">
                  <input type="checkbox" id="cb-landmark" defaultChecked="checked" />
                  Landmarks
                </label>
                <br />
                <label htmlFor="cb-launch-type">
                  <input type="checkbox" id="cb-launch-type" defaultChecked="checked" />
                  Launch Type
                </label>
                <br />
                <label htmlFor="cb-message">
                  <input type="checkbox" id="cb-message" defaultChecked="checked" />
                  Messages
                </label>
                <br />
              </div>
            </div>
          </div>
          <div className="button-section">
            <Button>Cancel</Button>
            <Button colorScheme="teal">Export</Button>
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
}

export default ExportCSV;
