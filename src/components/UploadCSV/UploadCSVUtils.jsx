import * as yup from 'yup';
import { FYABackend, isValidZip } from '../../common/utils';

function validateZip() {
  return this.test('isZip', function zipCheck(value) {
    console.log('VALIDATE ZIP CODE:', value);
    const { path, createError } = this;
    return isValidZip(value) ? true : createError({ path, message: 'Not a valid zip code' });
  });
}

function validateBoxNumber() {
  return this.test('boxNotExists', async function boxCheck(value) {
    console.log('VALIDATE BOX NUMBER:', value);
    const { path, createError } = this;
    const boxExists = await FYABackend.get(`/boxForm/exists/${value}`);
    return !boxExists.data
      ? true
      : createError({ path, message: `Box number ${value} already exists` });
  });
}

yup.addMethod(yup.string, 'isZip', validateZip);
yup.addMethod(yup.number, 'boxNotExists', validateBoxNumber);
export default yup
  .object({
    boxNumber: yup.number().boxNotExists().required().typeError('Invalid box number'),
    date: yup
      .date()
      .required('Invalid date, please enter a valid date')
      .typeError('Invalid date, please enter a valid date'),
    zipCode: yup.string().isZip().required('Invalid zipcode, please enter a valid zipcode'),
    boxLocation: yup.string(),
    message: yup.string(),
    picture: yup.string(),
    comments: yup.string(),
    launchedOrganically: yup.bool().default(false),
  })
  .required();
