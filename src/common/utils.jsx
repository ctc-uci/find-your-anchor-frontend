import axios from 'axios';
import isValidZipcode from 'is-valid-zipcode';
import { renderEmail } from 'react-html-email';

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
    return Promise.reject(error.response);
  },
);

// Reference auth_utils.js for an additional auth interceptor.

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

export const sendEmail = async (name, email, messageHtml) => {
  const response = await FYABackend.post('/nodemailer/send', {
    name,
    email,
    messageHtml: renderEmail(messageHtml),
  });
  if (response.status === 200) {
    alert('Email sent, awesome!');
  } else {
    alert('Oops, something went wrong. Try again');
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

export const BoxApprovedEmailPicture = `https://${process.env.REACT_APP_S3_URL}/BoxApprovedEmailPicture.png`;

export const BoxRejectedEmailPicture = `https://${process.env.REACT_APP_S3_URL}/BoxRejectedEmailPicture.png`;

export const ChangesRequestedEmailPicture = `https://${process.env.REACT_APP_S3_URL}/ChangesRequestedEmailPicture.png`;

export const FYATextLogo = `https://${process.env.REACT_APP_S3_URL}/fya-text-logo.png`;
