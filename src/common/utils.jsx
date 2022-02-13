import axios from 'axios';
<<<<<<< HEAD
import isValidZipcode from 'is-valid-zipcode';
=======
>>>>>>> dev

const baseURL = 'http://localhost:3001';

// Import this wherever you make calls to backend.
<<<<<<< HEAD
export const FYABackend = axios.create({
  baseURL,
  withCredentials: true,
});

export const isValidZip = zip => {
  const countries = [
    'US',
    'AT',
    'BG',
    'BR',
    'CA',
    'CZ',
    'DK',
    'FR',
    'DE',
    'IN',
    'IT',
    'IE',
    'MA',
    'NL',
    'PL',
    'PT',
    'RO',
    'RU',
    'SG',
    'SK',
    'ES',
    'SE',
    'CH',
    'GB',
  ];
  return countries.filter(country => isValidZipcode(zip, country)).length > 0;
};
=======
export default axios.create({
  baseURL,
  withCredentials: true,
});
>>>>>>> dev
