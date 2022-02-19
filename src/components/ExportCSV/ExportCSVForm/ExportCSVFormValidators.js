import { isValidZip } from '../../../common/utils';

function isZip(message) {
  return this.test('isZip', message, function zipCheck(value) {
    const { path, createError } = this;

    // Split string on commas, remove whitespaces
    const zips = value.split(',').map(e => e.replace(/\s+/g, ''));

    return zips.every(e => isValidZip(e))
      ? true
      : createError({ path, message: message ?? 'Not a valid zip code' });
  });
}

function isValidRange(message) {
  return this.test('isValidRange', message, function rangeCheck(value) {
    const { path, createError } = this;

    // Regex pattern to test if range starts
    // and ends with a digit, and only contains
    // digits and dashes
    const re = /(?=^(\d|-)+$)(?=^\d(.*\d)?$)/;

    // Split string on commas, remove whitespaces
    const ranges = value.split(',').map(e => e.replace(/\s+/g, ''));

    // Helper functions to check if every range
    // matches regex, and range is increasing
    const validChars = e => re.test(e);
    const increasingRange = e => {
      if (e.includes('-')) {
        const v = e.split('-').map(n => Number(n));
        return v[0] < v[1];
      }
      return true;
    };

    // Call helper functions on every array element
    return ranges.every(e => validChars(e) && increasingRange(e))
      ? true
      : createError({ path, message: message ?? 'Not a range' });
  });
}

export { isZip, isValidRange };
