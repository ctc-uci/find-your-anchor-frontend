import axios from 'axios';
import postalCodes from 'postal-codes-js';
import countryList from 'react-select-country-list';
import { renderEmail } from 'react-html-email';

const baseURL = `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`;

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
    return Promise.reject(error.response);
  },
);

export const isValidZip = zipCode => {
  const countries = countryList().getValues();
  return (
    countries.filter(countryCode => postalCodes.validate(countryCode, zipCode) === true).length > 0
  );
};

// Converts JS Date object into string, formatted MM/DD/YYYY
export const formatDate = value => {
  return value.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

export const sendEmail = async (name, email, messageHtml) => {
  const response = await FYABackend.post('/nodemailer/send', {
    name,
    email,
    messageHtml: renderEmail(messageHtml),
  });
  if (response.status === 200) {
    alert('Email sent, awesome!');
  } else {
    throw new Error('Oops, something went wrong. Try again');
  }
};

export const getLatLong = async (zipCode, country) => {
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/search?postalcode=${zipCode}&country=${country}&format=json`,
  );
  if (response.status === 200 && response.data.length > 0) {
    const { lat: latitude, lon: longitude } = response.data[0];
    return [latitude, longitude];
  }
  return [];
};
