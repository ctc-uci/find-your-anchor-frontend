import axios from 'axios';
import { FYABackend, isValidZip } from '../../common/utils';

function validateZip() {
  return this.test('isZip', function zipCheck(value) {
    const { path, createError } = this;
    return isValidZip(value) ? true : createError({ path, message: 'Not a valid zip code' });
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

export { validateZip, uploadBoxPhoto };
