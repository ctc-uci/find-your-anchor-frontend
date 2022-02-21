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
    const box = await FYABackend.get(`/boxForm/${value}`);
    return box.data.length === 0
      ? true
      : createError({ path, message: `Box no. ${value} already exists` });
  });
}

yup.addMethod(yup.string, 'isZip', validateZip);
yup.addMethod(yup.number, 'boxNotExists', validateBoxNumber);
export default yup
  .object({
    boxNumber: yup.number().boxNotExists().required().typeError('Missing/invalid box number'),
    date: yup.date().required().typeError('Missing/invalid date'),
    zipCode: yup.string().isZip().required('Missing zip code'),
    boxLocation: yup.string(),
    message: yup.string(),
    picture: yup.string(),
    comments: yup.string(),
    launchedOrganically: yup.bool().default(false),
  })
  .required();
