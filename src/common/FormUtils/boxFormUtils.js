import axios from 'axios';
import postalCodes from 'postal-codes-js';
import { FYABackend } from '../utils';

function validateZip() {
  return this.test('isZipInCountry', function zipCheck({ zipcode, country }) {
    const { path, createError } = this;

    const isValidMessage = postalCodes.validate(country.value, zipcode);

    // if both zip code and country fields are not empty
    if (zipcode && country.value) {
      // check if the entered zipcode exists in the country
      return isValidMessage === true ? true : createError({ path, message: isValidMessage });
    }

    return createError({ path, message: 'zip validated' });
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

export { validateZip, validateBoxNumber, uploadBoxPhoto };
