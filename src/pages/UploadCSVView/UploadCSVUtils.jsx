import * as yup from 'yup';
import { isValidZip } from '../../common/utils';

function validateZip() {
  return this.test('isZip', function zipCheck(value) {
    const { path, createError } = this;
    return isValidZip(value) ? true : createError({ path, message: 'Not a valid zip code' });
  });
}

yup.addMethod(yup.string, 'isZip', validateZip);
export default yup
  .object({
    boxNumber: yup.number().required().typeError('Invalid box number'),
    date: yup
      .date()
      .required('Invalid date, please enter a valid date')
      .typeError('Invalid date, please enter a valid date'),
    zipCode: yup.string().isZip().required('Invalid zipcode, please enter a valid zipcode'),
    launchedOrganically: yup.bool().default(false),
  })
  .required();
