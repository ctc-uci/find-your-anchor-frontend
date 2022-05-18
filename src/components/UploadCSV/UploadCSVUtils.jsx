import * as yup from 'yup';
import { FYABackend } from '../../common/utils';

function validateZipcodeInCountry() {
  return this.test('isZipInCountry', async function zipcodeAndCountryCheck({ zipCode, country }) {
    const { path, createError } = this;

    const { data: validationMessage } = await FYABackend.post(`/validateBox/countryZipcode`, {
      zipCode,
      country,
    });
    if (validationMessage !== 'success') {
      return createError({ path, message: validationMessage });
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
