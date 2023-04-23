/* eslint-disable */
import axios from 'axios';
import https from 'https';
import postalCodes from 'postal-codes-js';
import countryList from 'react-select-country-list';
import { renderEmail } from 'react-html-email';

import { refreshToken } from './auth_utils';

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
  httpsAgent: new https.Agent({ keepAlive: true }),
});

FYABackend.interceptors.response.use(
  response => response,
  async error => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          // check if 400 error was token
          if (data === '@verifyToken no access token') {
            // token has expired;
            try {
              // attempting to refresh token;
              await refreshToken();
              // token refreshed, reattempting request;
              const { config } = error.response;
              // configure new request in a new instance;
              return await axios({
                method: config.method,
                url: `${config.baseURL}${config.url}`,
                data: config.data,
                params: config.params,
                headers: config.headers,
                withCredentials: true,
              });
            } catch (e) {
              return Promise.reject(e);
            }
          } else {
            return Promise.reject(error);
          }
        case 500:
          if (process.env.NODE_ENV === 'production') window.location.href = '/500';
        default:
          return Promise.reject(error);
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      return Promise.reject(error);
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(error);
    }
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
    const { latitude, longitude } = response.data;
    return [latitude, longitude];
  }
  return [];
};

export const BoxApprovedEmailPicture = `https://${process.env.REACT_APP_S3_URL}/BoxApprovedEmailPicture.png`;

export const BoxRejectedEmailPicture = `https://${process.env.REACT_APP_S3_URL}/BoxRejectedEmailPicture.png`;

export const ChangesRequestedEmailPicture = `https://${process.env.REACT_APP_S3_URL}/ChangesRequestedEmailPicture.png`;

export const FYATextLogo = `https://${process.env.REACT_APP_S3_URL}/fya-text-logo.png`;

export const AdminApprovalProcessEmailSubject = 'Find Your Anchor Launch Map - Update';
