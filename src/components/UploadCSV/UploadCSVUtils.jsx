import * as yup from 'yup';
import countryList from 'react-select-country-list';
import { FYABackend } from '../../common/utils';
import zipcodeDataDump from '../../common/zipcodeDataDump.json';

function validateZipcodeInCountry() {
  return this.test('isZipInCountry', async function zipcodeAndCountryCheck({ zipCode, country }) {
    const { path, createError } = this;

    // convert country to its country code

    if (country === undefined) {
      return createError({ path, message: 'Missing or invalid country name' });
    }

    const countryCode = countryList().getValue(country);

    // check if country field (country must be entered in its full country name) is valid
    // and if country can be found in the country-zipcode data dump
    if (countryCode === undefined || zipcodeDataDump[countryCode] === undefined) {
      return createError({ path, message: 'Missing or invalid country name' });
    }

    // use country-zipcode data dump to check if zipcode exists in country
    if (!zipcodeDataDump[countryCode][zipCode]) {
      return createError({ path, message: `Zipcode ${zipCode} does not exist in this country` });
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

    if (boxNumber in boxNumberMap && boxNumberMap[boxNumber] > 1) {
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
