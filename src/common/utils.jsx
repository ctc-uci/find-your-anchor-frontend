import axios from 'axios';
import postalCodes from 'postal-codes-js';
import countryList from 'react-select-country-list';
import { renderEmail } from 'react-html-email';

let baseURL = '';
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  // dev code
  baseURL = `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`;
} else {
  // production code
  baseURL = `${process.env.REACT_APP_PROD_API_URL}`;
}

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

    // Redirect to internal server error page for 500 errors.
    if (error.toJSON().status === 500 && process.env.NODE_ENV === 'production') {
      window.location.href = '/500';
    }
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

export const sendEmail = async (name, email, messageHtml, subject) => {
  const response = await FYABackend.post('/nodemailer/send', {
    name,
    email,
    messageHtml: renderEmail(messageHtml),
    subject,
  });
  if (response.status !== 200) {
    throw new Error('Oops, something went wrong. Try again');
  }
};

export const getLatLong = async (zipCode, country) => {
  const response = await FYABackend.get('/boxHistory/latLong', {
    params: {
      zipCode,
      country,
    },
  });
  if (response.data) {
    const { lat: latitude, lng: longitude } = response.data;
    return [latitude, longitude];
  }
  return [];
};

export const BoxApprovedEmailPicture = `https://${process.env.REACT_APP_S3_URL}/BoxApprovedEmailPicture.png`;

export const BoxRejectedEmailPicture = `https://${process.env.REACT_APP_S3_URL}/BoxRejectedEmailPicture.png`;

export const ChangesRequestedEmailPicture = `https://${process.env.REACT_APP_S3_URL}/ChangesRequestedEmailPicture.png`;

export const FYATextLogo = `https://${process.env.REACT_APP_S3_URL}/fya-text-logo.png`;

export const AdminApprovalProcessEmailSubject = 'Find Your Anchor Launch Map - Update';
