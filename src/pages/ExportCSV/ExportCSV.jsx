import React from 'react';
import { ChakraProvider, Select, Button, Input, FormLabel } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import './ExportCSV.css';

function ExportCSV() {
  const [sortOption, setSortOption] = React.useState('ascend');
  const [boxesOption, setBoxesOption] = React.useState('all');
  const [dateOption, setDate] = React.useState('all');
  const [launchOption, setLaunchOption] = React.useState('both');
  const [zipOption, setZipOption] = React.useState('all');
  const [customBoxes, setCustomBoxes] = React.useState('');
  const [customDate, setCustomDate] = React.useState(new Date());
  const [customStartDate, setCustomStartDate] = React.useState('');
  const [customEndDate, setCustomEndDate] = React.useState('');
  const [customZip, setCustomZip] = React.useState('');

  // Function to check valid range
  function checkRange(value) {
    if (value === '') {
      return false;
    }
    if (value.includes(',')) {
      const ranges = value.split(', ');
      for (let i = 0; i < ranges.length; i += 1) {
        if (ranges[i].includes('-')) {
          const numbers = ranges[i].split('-');
          if (!Number.isNaN(Number(numbers[0])) && !Number.isNaN(Number(numbers[1]))) {
            if (numbers[0] > numbers[1]) {
              return true;
            }
          } else if (Number.isNaN(Number(numbers[0])) || Number.isNaN(Number(numbers[1]))) {
            return true;
          }
        } else {
          return Number.isNaN(Number(ranges[i]));
        }
      }
    } else if (value.includes('-')) {
      const numbers = value.split('-');
      if (!Number.isNaN(Number(numbers[0])) && !Number.isNaN(Number(numbers[1]))) {
        if (numbers[0] > numbers[1]) {
          return true;
        }
      } else if (Number.isNaN(Number(numbers[0])) || Number.isNaN(Number(numbers[1]))) {
        return true;
      }
    } else {
      return Number.isNaN(Number(value));
    }
    return false;
  }

  // Function to check valid zip code
  function checkZip(value) {
    if (value === '') {
      return false;
    }
    if (value.length === 5 && !Number.isNaN(Number(value))) {
      return false;
    }
    return true;
  }

  return (
    <ChakraProvider>
      <div className="export-csv-container">
        <div className="export-table-preview">
          <img alt="sample" src="https://pngimg.com/uploads/box/box_PNG49.png" />
        </div>
        <div className="filter-section">
          <div className="two-text-header">
            <p style={{ fontSize: '36px', fontWeight: '700' }}>Export CSV</p>
            <p style={{ fontSize: '26px' }}>30 boxes</p>
          </div>
          <div className="section">
            <p className="option-header">Sort By</p>
            <Select
              fontSize="20px"
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
            >
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
                    value={boxesOption}
                    onChange={e => setBoxesOption(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="custom">Custom</option>
                  </Select>
                  {boxesOption === 'custom' && (
                    <div>
                      <Input
                        value={customBoxes}
                        className="custom-text"
                        placeholder="e.g. 1-9, 6, 12"
                        isInvalid={checkRange(customBoxes)}
                        onChange={e => setCustomBoxes(e.target.value)}
                      />
                      {checkRange(customBoxes) && (
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
                      value={dateOption}
                      onChange={e => setDate(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="single">Single Day</option>
                      <option value="range">Range</option>
                    </Select>
                    {dateOption === 'single' && (
                      <DatePicker
                        className="single-date-picker"
                        placeholderText="MM/DD/YY"
                        selected={customDate}
                        onChange={date => setCustomDate(date)}
                      />
                    )}
                    {dateOption === 'range' && (
                      <div>
                        <div className="custom-range-boxes">
                          <div>
                            <FormLabel fontSize="16px" className="date-label" htmlFor="from-date">
                              Start
                            </FormLabel>
                            <DatePicker
                              className="range-date-picker"
                              placeholderText="MM/DD/YY"
                              selected={customStartDate}
                              onChange={date => setCustomStartDate(date)}
                              selectsStart
                              startDate={customStartDate}
                              endDate={customEndDate}
                            />
                          </div>
                          <div>
                            <FormLabel fontSize="16px" className="date-label" htmlFor="from-date">
                              End
                            </FormLabel>
                            <DatePicker
                              className="range-date-picker"
                              placeholderText="MM/DD/YY"
                              selected={customEndDate}
                              onChange={date => setCustomEndDate(date)}
                              selectsEnd
                              startDate={customStartDate}
                              endDate={customEndDate}
                              minDate={customStartDate}
                            />
                          </div>
                        </div>
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
                  value={launchOption}
                  onChange={e => setLaunchOption(e.target.value)}
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
                    value={zipOption}
                    onChange={e => setZipOption(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="custom">Custom</option>
                  </Select>
                  {zipOption === 'custom' && (
                    <div>
                      <Input
                        value={customZip}
                        className="custom-text"
                        placeholder="e.g. 96162, 91007"
                        isInvalid={checkZip(customZip)}
                        onChange={e => setCustomZip(e.target.value)}
                      />
                      {checkZip(customZip) && (
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
