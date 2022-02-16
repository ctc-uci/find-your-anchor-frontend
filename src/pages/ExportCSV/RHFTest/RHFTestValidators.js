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

function test() {}

export { isPalindrome, test };
