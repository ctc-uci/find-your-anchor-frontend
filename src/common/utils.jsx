import axios from 'axios';
import isValidZipcode from 'is-valid-zipcode';

const baseURL = 'http://localhost:3001';

// Import this wherever you make calls to backend.
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
