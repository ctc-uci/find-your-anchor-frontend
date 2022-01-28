import React from 'react';
import { ChakraProvider, Select, Button, Input, FormControl, FormLabel } from '@chakra-ui/react';

import './ExportCSV.css';

// use Modal Dialog Chakra for a popup rather than a page
// https://chakra-ui.com/docs/overlay/modal
// have modal popup be 50% device height by 50% device width
// with a gray background with transparency to cover map behind it

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
            <p style={{ fontSize: '36px', fontWeight: '700' }}>Export CSV</p>
            <p style={{ fontSize: '26px' }}>30 boxes</p>
          </div>
          <div className="section">
            <p className="option-header">Sort By</p>
            <Select fontSize="20px" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="ascend-box-num">Ascending Box Number</option>
              <option value="descend-box-num">Descending Box Number</option>
              <option value="chronologic">Chronologically</option>
              <option value="ascend-zip-code">Descending Zip Code</option>
              <option value="descend-zip-code">Descending Zip Code</option>
            </Select>
          </div>
          <div className="section">
            <p className="option-header">Filter Options</p>
            <div className="filter-options">
              <p className="filter-names">Boxes</p>
              <div className="drop-option">
                <Select
                  fontSize="20px"
                  width="200px"
                  value={boxes}
                  onChange={e => setBoxes(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="custom">Custom</option>
                </Select>
                {boxes === 'custom' && (
                  <Input fontSize="20px" width="200px" placeholder="e.g. 1-9, 6, 12" />
                )}
              </div>
            </div>
            <div className="filter-options">
              <p className="filter-names">Date</p>
              <div className="drop-option">
                <Select
                  fontSize="20px"
                  width="200px"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                >
                  <option value="none">None</option>
                  <option value="custom">Custom</option>
                </Select>
                {date === 'custom' && (
                  <div className="custom-date">
                    <FormControl>
                      <FormLabel fontSize="18px" className="date-label" htmlFor="from-date">
                        From
                      </FormLabel>
                      <Input id="from-date" fontSize="20px" width="200px" placeholder="1/1/2022" />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="18px" className="date-label" htmlFor="from-date">
                        To
                      </FormLabel>
                      <Input id="to-date" fontSize="20px" width="200px" placeholder="1/1/2022" />
                    </FormControl>
                  </div>
                )}
              </div>
            </div>
            <div className="filter-options">
              <p className="filter-names">Launch Type</p>
              <Select
                fontSize="20px"
                width="200px"
                value={launch}
                onChange={e => setLaunch(e.target.value)}
              >
                <option value="both">Both</option>
                <option value="organically">Organically</option>
                <option value="directly">Directly</option>
              </Select>
            </div>
            <div className="filter-options">
              <p className="filter-names">Zip Code</p>
              <div className="drop-option">
                <Select
                  fontSize="20px"
                  width="200px"
                  value={zip}
                  onChange={e => setZip(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="custom">Custom</option>
                </Select>
                {zip === 'custom' && <Input fontSize="20px" width="200px" placeholder="92697" />}
              </div>
            </div>
          </div>
          <div className="section">
            <div className="two-text-header">
              <p className="option-header">Box Details</p>
              <Button
                variant="link"
                style={{ fontSize: '18px' }}
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
                <label className="checkbox-message" htmlFor="cb-box-number">
                  <input type="checkbox" id="cb-box-number" defaultChecked="checked" />
                  Box Number
                </label>
                <br />
                <label className="checkbox-message" htmlFor="cb-date">
                  <input type="checkbox" id="cb-date" defaultChecked="checked" />
                  Date
                </label>
                <br />
                <label className="checkbox-message" htmlFor="cb-zip-code">
                  <input type="checkbox" id="cb-zip-code" defaultChecked="checked" />
                  Zip Code
                </label>
                <br />
              </div>
              <div>
                <label className="checkbox-message" htmlFor="cb-landmark">
                  <input type="checkbox" id="cb-landmark" defaultChecked="checked" />
                  Landmarks
                </label>
                <br />
                <label className="checkbox-message" htmlFor="cb-launch-type">
                  <input type="checkbox" id="cb-launch-type" defaultChecked="checked" />
                  Launch Type
                </label>
                <br />
                <label className="checkbox-message" htmlFor="cb-message">
                  <input type="checkbox" id="cb-message" defaultChecked="checked" />
                  Messages
                </label>
                <br />
              </div>
            </div>
          </div>
          <div className="button-section">
            <Button style={{ fontSize: '18px' }}>Cancel</Button>
            <Button style={{ fontSize: '18px' }} colorScheme="teal">
              Export
            </Button>
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
}

export default ExportCSV;
