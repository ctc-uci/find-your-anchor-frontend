import axios from 'axios';
import isValidZipcode from 'is-valid-zipcode';

const baseURL = 'http://localhost:3001';

// Import this wherever you make calls to backend.
export const FYABackend = axios.create({
  baseURL,
  withCredentials: true,
});

FYABackend.interceptors.response.use(
  response => response,
  error => {
    // eslint-disable-next-line no-console
    console.error(`[Axios] FYABackend error: ${JSON.stringify(error.toJSON(), null, 2)}`);
  },
);

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

// Converts JS Date object into string, formatted MM/DD/YYYY
export const formatDate = value => {
  return value.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
};
