import * as yup from 'yup';
import postalCodes from 'postal-codes-js';
import countryList from 'react-select-country-list';
import { FYABackend } from '../../common/utils';

// OLD CODE: to be removed
// function validateZip() {
//   return this.test('isZip', function zipCheck(value) {
//     const { path, createError } = this;
//     return isValidZip(value) ? true : createError({ path, message: 'Invalid zip code' });
//   });
// }

function validateZipcodeInCountry() {
  return this.test('isZipInCountry', function zipcodeAndCountryCheck({ zipCode, country }) {
    const { path, createError } = this;
    console.log(zipCode, country);
    // convert country to its country code
    const countryCode = countryList().getValue(country);
    // check if country field (country must be entered in its full country name) is valid
    if (countryCode === undefined) {
      return createError({ path, message: 'Missing or invalid country name' });
    }
    // if both zip code and country fields are not empty
    if (zipCode && country) {
      // validate if zipcode exists in the country code
      const isValidMessage = postalCodes.validate(countryCode, zipCode);
      return isValidMessage === true ? true : createError({ path, message: isValidMessage });
    }
    return true;
  });
}

function validateBoxNumber() {
  return this.test('boxNotExists', async function boxCheck(value) {
    const { path, createError } = this;
    const box = await FYABackend.get(`/anchorBox/box/${value}`);
    return box.data.length === 0
      ? true
      : createError({ path, message: `Box number ${value} already exists` });
  });
}

yup.addMethod(yup.object, 'isZipInCountry', validateZipcodeInCountry);
yup.addMethod(yup.number, 'boxNotExists', validateBoxNumber);
export default yup
  .object({
    boxNumber: yup.number().boxNotExists().required().typeError('Missing or invalid box number'),
    date: yup.date().required().typeError('Missing or invalid date'),
    zipCode: yup.string().required('Missing zip code'),
    launchedOrganically: yup.bool().default(false),
    country: yup.string(),
  })
  .isZipInCountry()
  .required();
