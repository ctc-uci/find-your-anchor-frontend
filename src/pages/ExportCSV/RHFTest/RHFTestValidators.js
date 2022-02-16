import { isValidZip } from '../../../common/utils';

function isPalindrome(message) {
  return this.test('isPalindrome', message, function palindromeCheck(value) {
    const { path, createError } = this;

    const re = /[\W_]/g;
    const lowRegStr = value.toLowerCase().replace(re, '');
    const reverseStr = lowRegStr.split('').reverse().join('');

    if (reverseStr === lowRegStr) {
      return true;
    }

    return createError({ path, message: message ?? 'Not a palindrome' });
  });
}

function isZip(message) {
  return this.test('isZip', message, function zipCheck(value) {
    const { path, createError } = this;

    if (value.includes(', ')) {
      const ranges = value.split(', ');
      for (let i = 0; i < ranges.length; i += 1) {
        if (ranges[i] === '') {
          return true;
        }
        if (!isValidZip(ranges[i])) {
          return true;
        }
      }
    } else if (!isValidZip(value)) {
      return true;
    }
    return createError({ path, message: message ?? 'Not a valid Zip' });
  });
}

export { isPalindrome, isZip };
