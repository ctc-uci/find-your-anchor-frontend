import * as yup from 'yup';
import postalCodes from 'postal-codes-js';
import countryList from 'react-select-country-list';
import { FYABackend } from '../../common/utils';
// TO BE DELETED: import { FYABackend, getLatLong } from '../../common/utils';

// TO BE DELETED:
// function validateZip() {
//   return this.test('isZip', function zipCheck(value) {
//     const { path, createError } = this;
//     return isValidZip(value) ? true : createError({ path, message: 'Invalid zip code' });
//   });
// }

function validateZipcodeInCountry() {
  return this.test('isZipInCountry', async function zipcodeAndCountryCheck({ zipCode, country }) {
    const { path, createError } = this;

    // convert country to its country code
    const countryCode = countryList().getValue(country);
    // check if country field (country must be entered in its full country name) is valid
    if (countryCode === undefined) {
      return createError({ path, message: 'Missing or invalid country name' });
    }
    // if both zip code and country fields are not empty
    if (zipCode && country) {
      // the postal-codes-js library checks if zipcode is in the valid postal code format for the country
      const isValidMessage = postalCodes.validate(countryCode, zipCode);
      // check if Nominatim API can find lat/long for zipcode
      if (isValidMessage !== true) {
        return createError({ path, message: `Cannot find ${zipCode} in this country` });
      }
      // TO BE DELETED:
      // const [latitude, longitude] = await getLatLong(zipCode, countryCode);
      // if (isValidMessage !== true || latitude === undefined || longitude === undefined) {
      //   return createError({ path, message: `Cannot find ${zipCode} in this country` });
      // }
    }
    return true;
  });
}

function validateBoxNumber(boxNumberMap) {
  return this.test('boxNotExists', { boxNumberMap }, async function boxCheck(value) {
    const { path, createError } = this;
    const box = await FYABackend.get(`/anchorBox/box/${value}`);
    return box.data.length === 0
      ? true
      : createError({ path, message: `Box number ${value} already exists` });
  });
}

// TO BE DELETED: yup.addMethod(yup.string, 'isZip', validateZip);
yup.addMethod(yup.object, 'isZipInCountry', validateZipcodeInCountry);
yup.addMethod(yup.number, 'boxNotExists', validateBoxNumber);
export default yup
  .object({
    boxNumber: yup.number().boxNotExists().required().typeError('Missing or invalid box number'),
    date: yup.date().required().typeError('Missing or invalid date'),
    zipCode: yup.string().required('Missing or invalid zip code'),
    country: yup.string(),
    launchedOrganically: yup.bool().default(false),
  })
  .isZipInCountry()
  .required();
