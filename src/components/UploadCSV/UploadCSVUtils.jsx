import * as yup from 'yup';
import postalCodes from 'postal-codes-js';
import countryList from 'react-select-country-list';
import { FYABackend } from '../../common/utils';

function validateZipcodeInCountry() {
  return this.test('isZipInCountry', async function zipcodeAndCountryCheck({ zipCode, country }) {
    const { path, createError } = this;

    // convert country to its country code

    if (country === undefined) {
      return createError({ path, message: 'Missing or invalid country name' });
    }

    const countryCode = countryList().getValue(country);

    // check if country field (country must be entered in its full country name) is valid
    if (countryCode === undefined) {
      return createError({ path, message: 'Missing or invalid country name' });
    }
    // if both zip code and country fields are not empty
    if (zipCode && country) {
      // the postal-codes-js library checks if zipcode is in the valid postal code format for the country
      const isValidMessage = postalCodes.validate(countryCode, zipCode);
      if (isValidMessage !== true) {
        return createError({ path, message: `Cannot find ${zipCode} in this country` });
      }

      // TODO: use zipcode data dump to check if zipcode exists in country
      // instead. Nominatim API allows a maximum of one request per second only.
    }
    return true;
  });
}

function validateBoxNumber() {
  return this.test('boxNotExists', async function boxCheck(boxNumber, option) {
    const { path, createError } = this;
    const boxNumberMap = option.options.context;

    const box = await FYABackend.get(`/anchorBox/box/${boxNumber}`);

    if (box.data.length !== 0) {
      return createError({ path, message: `Box number already exists: ${boxNumber}` });
    }

    // if box number if found on more than one row
    if (boxNumberMap.has(boxNumber) && boxNumberMap.get(boxNumber).size > 1) {
      return createError({ path, message: `Duplicate found: ${boxNumber}` });
    }

    return true;
  });
}

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
