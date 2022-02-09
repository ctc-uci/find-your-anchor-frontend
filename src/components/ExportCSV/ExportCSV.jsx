import React from 'react';
import { ChakraProvider, Select, Button, Input, FormLabel } from '@chakra-ui/react';

import './ExportCSV.css';

function ExportCSV() {
  const [sort, setSort] = React.useState('ascend');
  const [boxes, setBoxes] = React.useState('all');
  const [date, setDate] = React.useState('all');
  const [launch, setLaunch] = React.useState('both');
  const [zip, setZip] = React.useState('all');
  const [boxesCustom, setBoxesCustom] = React.useState('');
  const [dateCustom, setDateCustom] = React.useState('');
  const [startCustom, setStartCustom] = React.useState('');
  const [endCustom, setEndCustom] = React.useState('');
  const [zipCustom, setZipCustom] = React.useState('');

  // Function to check valid range
  function checkRange(value) {
    if (value === '') return false;
    if (value.includes('-')) {
      const numbers = value.split('-');
      if (!Number.isNaN(Number(numbers[0])) && !Number.isNaN(Number(numbers[1]))) {
        if (numbers[0] < numbers[1]) {
          return false;
        }
      }
    } else {
      if (!Number.isNaN(Number(value))) return false;
      return true;
    }
    return true;
  }

  // Function to check the valid date
  function checkDate(value) {
    const dates = {
      1: 31,
      2: 28,
      3: 31,
      4: 30,
      5: 31,
      6: 30,
      7: 31,
      8: 31,
      9: 30,
      10: 31,
      11: 30,
      12: 31,
    };
    if (value === '') return false;
    const numbers = value.split('/');
    if (
      Number.isNaN(Number(numbers[0])) ||
      Number.isNaN(Number(numbers[1])) ||
      Number.isNaN(Number(numbers[2]))
    )
      return true;
    if (numbers[2].length !== 2) return true;
    if (numbers[0] === '2' && numbers[2] % 4 === 0) dates[2] += 1;
    if (
      Object.keys(dates).includes(numbers[0]) &&
      numbers[1] >= 1 &&
      numbers[1] <= dates[numbers[0]] &&
      numbers[2] != null
    )
      return false;
    return true;
  }

  // Function to check if start date is less than end date
  function checkDateLess(value1, value2) {
    if (checkDate(value1) || checkDate(value2)) return true;
    const start = value1.split('/');
    const end = value2.split('/');
    if (end[2] - start[2] < 0) {
      return true;
    }
    if (end[2] - start[2] === 0) {
      if (end[1] - start[1] < 0) {
        return true;
      }
      if (end[1] - start[1] === 0) {
        if (end[0] - start[0] < 0) {
          return true;
        }
      }
    }
    return false;
  }

  // Function to check valid zip code
  function checkZip(value) {
    if (value === '') return false;
    if (value.length === 5 && !Number.isNaN(Number(value))) return false;
    return true;
  }

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
            <div className="filters">
              <div className="filter-options">
                <p className="filter-names">Boxes</p>
                <div className="drop-option">
                  <Select
                    fontSize="20px"
                    width="300px"
                    value={boxes}
                    onChange={e => setBoxes(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="custom">Custom</option>
                  </Select>
                  {boxes === 'custom' && (
                    <div>
                      <Input
                        value={boxesCustom}
                        className="custom-text"
                        placeholder="e.g. 1-9, 6, 12"
                        isInvalid={checkRange(boxesCustom)}
                        onChange={e => setBoxesCustom(e.target.value)}
                      />
                      {checkRange(boxesCustom) && (
                        <p className="error-message">Invalid page range, e.g. 1-9, 6, 12</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="filter-options">
                  <p className="filter-names">Date</p>
                  <div className="drop-option">
                    <Select
                      fontSize="20px"
                      width="300px"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="single">Single Day</option>
                      <option value="range">Range</option>
                    </Select>
                    {date === 'single' && (
                      <div>
                        <Input
                          value={dateCustom}
                          className="custom-text"
                          placeholder="MM/DD/YY"
                          isInvalid={checkDate(dateCustom)}
                          onChange={e => setDateCustom(e.target.value)}
                        />
                        {checkDate(dateCustom) && (
                          <p className="error-message">Invalid date, use MM/DD/YY format</p>
                        )}
                      </div>
                    )}
                    {date === 'range' && (
                      <div>
                        <div className="custom-range-boxes">
                          <div>
                            <FormLabel fontSize="16px" className="date-label" htmlFor="from-date">
                              Start
                            </FormLabel>
                            <Input
                              value={startCustom}
                              id="from-date"
                              className="custom-range"
                              placeholder="MM/DD/YY"
                              isInvalid={checkDateLess(startCustom, endCustom)}
                              onChange={e => setStartCustom(e.target.value)}
                            />
                          </div>
                          <div>
                            <FormLabel fontSize="16px" className="date-label" htmlFor="from-date">
                              End
                            </FormLabel>
                            <Input
                              value={endCustom}
                              id="to-date"
                              className="custom-range"
                              placeholder="MM/DD/YY"
                              isInvalid={checkDateLess(startCustom, endCustom)}
                              onChange={e => setEndCustom(e.target.value)}
                            />
                          </div>
                        </div>
                        {checkDateLess(startCustom, endCustom) && (
                          <p className="error-message">Invalid date, use MM/DD/YY format</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="filter-options">
                <p className="filter-names">Launch Type</p>
                <Select
                  fontSize="20px"
                  width="300px"
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
                    width="300px"
                    value={zip}
                    onChange={e => setZip(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="custom">Custom</option>
                  </Select>
                  {zip === 'custom' && (
                    <div>
                      <Input
                        value={zipCustom}
                        className="custom-text"
                        placeholder="e.g. 96162, 91007"
                        isInvalid={checkZip(zipCustom)}
                        onChange={e => setZipCustom(e.target.value)}
                      />
                      {checkZip(zipCustom) && (
                        <p className="error-message">Invalid zipcode, use e.g. 92602, 92123</p>
                      )}
                    </div>
                  )}
                </div>
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
