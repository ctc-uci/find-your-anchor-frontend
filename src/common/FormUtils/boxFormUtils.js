import axios from 'axios';
import postalCodes from 'postal-codes-js';
import { FYABackend } from '../utils';

// validateZip() uses the postal-codes-js library
// to check if a given zipcode has the the correct
// postal code format for a country. for example, if you
// have 92777 as the zipcode and US as the country,
// this function will only check that this zipcode is in
// the correct 5-digit postal format, but the library cannot
// actually detect if the zipcode 92777 is a real zipcode in US
function validateZip() {
  return this.test('isZipInCountry', function zipCheck({ zipcode, country }) {
    const { path, createError } = this;

    const isValidMessage = postalCodes.validate(country.value, zipcode);

    // if both zip code and country fields are not empty
    if (zipcode && country.value) {
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

function validateBoxIdInAnchorBox() {
  return this.test('boxExists', async function boxCheck(value) {
    const { path, createError } = this;
    const box = await FYABackend.get(`/anchorBox/box/${value.boxID}`);
    return box.data.length !== 0
      ? true
      : createError({ path, message: `Box number ${value} does not exist` });
  });
}

const uploadBoxPhoto = async file => {
  // get S3 upload url from server
  const { data: uploadUrl } = await FYABackend.get('/s3Upload');

  // upload image directly to S3 bucket
  await axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  // return box image url
  const imageUrl = uploadUrl.split('?')[0];
  return imageUrl;
};

export { validateZip, validateBoxNumber, uploadBoxPhoto, validateBoxIdInAnchorBox };
