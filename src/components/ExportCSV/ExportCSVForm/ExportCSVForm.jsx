import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker from 'react-datepicker';
import * as yup from 'yup';

import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  Radio,
  Checkbox,
  Button,
} from '@chakra-ui/react';
import './ExportCSVForm.css';
import { isValidRange, isZip } from './ExportCSVFormValidators';

yup.addMethod(yup.mixed, 'isZip', isZip);
yup.addMethod(yup.mixed, 'isValidRange', isValidRange);
const schema = yup
  .object({
    sortBy: yup.string().required(),
    zipCode: yup.mixed().isZip(),
    boxRange: yup.mixed().isValidRange(),
  })
  .required();

const ExportCSVForm = ({ formID, setFormValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    delayError: 750,
  });

  const onSubmit = data => {
    alert(JSON.stringify(data, null, 2));
    setFormValues(data);
  };

  const [boxesOption, setBoxesOption] = React.useState('all');
  const [dateOption, setDateOption] = React.useState('all');
  const [zipOption, setZipOption] = React.useState('all');

  return (
    <div className="csv-form-wrapper">
      <form id={formID} onSubmit={handleSubmit(onSubmit)}>
        {/* <FormControl isInvalid={errors?.temp}>
          <FormLabel htmlFor="temp">Temp Field</FormLabel>
          <Input id="temp" placeholder="Enter Text" {...register('temp')} />
          <p className="error-message">{errors.temp?.message}</p>
        </FormControl> */}

        <FormControl className="section-wrapper" isInvalid={errors?.sortBy}>
          <FormLabel htmlFor="sort-by" className="csv-form-labels">
            Sort By
          </FormLabel>
          <Select id="sort-by" {...register('sortBy')}>
            <option value="ascend-box-num">Ascending Box Number</option>
            <option value="descend-box-num">Descending Box Number</option>
            <option value="chronologic">Chronologically</option>
            <option value="ascend-zip-code">Descending Zip Code</option>
            <option value="descend-zip-code">Descending Zip Code</option>
          </Select>
          <p className="error-message">{errors.sortBy?.message}</p>
        </FormControl>

        <div className="filter-section-wrapper">
          <div className="filter-option-wrapper">
            <Text className="csv-form-labels">Filter Options</Text>
            <div className="filter-choices">
              <FormControl
                className="section-wrapper filter-label-select"
                isInvalid={errors?.sortBy}
                {...register('boxRange')}
              >
                <FormLabel htmlFor="boxes">Boxes</FormLabel>
                <div className="input-drop-down">
                  <Select
                    id="boxes"
                    className="select-filter-options"
                    value={boxesOption}
                    onChange={e => setBoxesOption(e.target.value)}
                  >
                    <option value="boxes-all">All</option>
                    <option value="boxes-custom">Custom</option>
                  </Select>
                  <Input
                    isInvalid={errors?.boxRange}
                    placeholder="e.g. 1-9, 6, 12"
                    className={`custom-input ${boxesOption === 'boxes-custom' ? 'active' : ''}`}
                  />
                  <p className="error-message">{errors.boxRange?.message}</p>
                </div>
              </FormControl>
            </div>
            <div className="filter-choices">
              <FormControl
                className="section-wrapper filter-label-select"
                isInvalid={errors?.sortBy}
              >
                <FormLabel htmlFor="date">Date</FormLabel>
                <div className="input-drop-down">
                  <Select
                    id="date"
                    className="select-filter-options"
                    value={dateOption}
                    onChange={e => setDateOption(e.target.value)}
                  >
                    <option value="ascend-box-num">All</option>
                    <option value="descend-box-num">Single Day</option>
                    <option value="descend-box-num">Range</option>
                  </Select>
                  <DatePicker
                    className="date-picker"
                    placeholderText="MM/DD/YY"
                    // selected={customDate}
                    // onChange={date => setCustomDate(date)}
                  />
                  <p className="error-message">{errors.sortBy?.message}</p>
                </div>
              </FormControl>
            </div>
            <div className="filter-choices">
              <FormControl
                className="section-wrapper filter-label-select"
                isInvalid={errors?.sortBy}
              >
                <FormLabel htmlFor="zip">Zip Code</FormLabel>
                <div className="input-drop-down">
                  <Select
                    id="zip"
                    className="select-filter-options"
                    value={zipOption}
                    onChange={e => setZipOption(e.target.value)}
                  >
                    <option value="zip-code-all">All</option>
                    <option value="zip-code-custom">Custom</option>
                  </Select>
                  <Input
                    isInvalid={errors?.zipCode}
                    placeholder="e.g. 96162, 91007"
                    className={`custom-input ${zipOption === 'zip-code-custom' ? 'active' : ''}`}
                    {...register('zipCode')}
                  />
                  <p className="error-message">{errors.zipCode?.message}</p>
                </div>
              </FormControl>
            </div>
            <div className="filter-choices">
              <FormControl
                className="section-wrapper filter-label-select"
                isInvalid={errors?.sortBy}
              >
                <Text>Launch Organically?</Text>
                <Radio>Yes</Radio>
                <Radio>No</Radio>
              </FormControl>
              <p className="error-message">{errors.sortBy?.message}</p>
            </div>
          </div>
          <FormControl className="section-wrapper" isInvalid={errors?.sortBy}>
            <div className="box-detail-header">
              <Text className="csv-form-labels">Box Details</Text>
              <Button variant="link">Unselect All</Button>
            </div>
            <div className="box-detail-checkboxes">
              <Checkbox>Date</Checkbox>
              <Checkbox>Box Number</Checkbox>
              <Checkbox>Zip Code</Checkbox>
              <Checkbox>Image</Checkbox>
              <Checkbox>Landmarks</Checkbox>
              <Checkbox>Launch Type</Checkbox>
              <Checkbox>Messages</Checkbox>
            </div>
          </FormControl>
        </div>
      </form>
    </div>
  );
};

ExportCSVForm.propTypes = {
  formID: PropTypes.string.isRequired,
  setFormValues: PropTypes.func.isRequired,
};

export default ExportCSVForm;
