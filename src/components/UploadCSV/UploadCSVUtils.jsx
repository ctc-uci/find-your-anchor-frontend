import * as yup from 'yup';
import { FYABackend, isValidZip } from '../../common/utils';

function validateZip() {
  return this.test('isZip', function zipCheck(value) {
    const { path, createError } = this;
    return isValidZip(value) ? true : createError({ path, message: 'Invalid zip code' });
  });
}

function validateBoxNumber() {
  return this.test('boxNotExists', async function boxCheck(value) {
    const { path, createError } = this;
    const box = await FYABackend.get(`/anchorBox/box/${value}`);

    if (box.data.length > 0) {
      return createError({ path, message: `Box number ${value} already exists` });
    }

    return true;
  });
}

yup.addMethod(yup.string, 'isZip', validateZip);
yup.addMethod(yup.number, 'boxNotExists', validateBoxNumber);
export default yup
  .object({
    boxNumber: yup.number().boxNotExists().required().typeError('Missing or invalid box number'),
    date: yup.date().required().typeError('Missing or invalid date'),
    zipCode: yup.string().isZip().required('Missing or invalid zip code'),
    launchedOrganically: yup.bool().default(false),
  })
  .required();
