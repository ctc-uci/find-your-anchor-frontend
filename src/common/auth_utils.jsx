import React from 'react';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { cookieKeys, cookieConfig, clearCookies } from './cookie_utils';
// eslint-disable-next-line import/no-cycle
import { FYABackend, sendEmail } from './utils';

import AdminInviteEmail from '../components/Email/EmailTemplates/AdminInviteEmail';

// Using Firebase Web version 9
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const refreshUrl = `https://securetoken.googleapis.com/v1/token?key=${process.env.REACT_APP_FIREBASE_APIKEY}`;

/**
 * Sets a cookie in the browser
 * @param {string} key key for the cookie
 * @param {string} value value for the cookie
 * @param {cookieConfig} config cookie config to use
 */
const setCookie = (key, value, config) => {
  let cookie = `${key}=${value}; max-age=${config.maxAge}; path=${config.path}`;
  if (config.domain) {
    cookie += `; domain=${config.domain}`;
  }
  if (config.secure) {
    cookie += '; secure';
  }
  document.cookie = cookie;
};

/**
 * Returns the current user synchronously
 * @param {Auth} authInstance
 * @returns The current user (or undefined)
 */
const getCurrentUser = authInstance =>
  new Promise((resolve, reject) => {
    const unsubscribe = authInstance.onAuthStateChanged(
      user => {
        unsubscribe();
        resolve(user);
      },
      err => {
        reject(err);
      },
    );
  });

// Refreshes the current user's access token by making a request to Firebase
const refreshToken = async () => {
  const currentUser = await getCurrentUser(auth);
  if (currentUser) {
    const refreshT = currentUser.refreshToken;
    const {
      data: { access_token: idToken },
    } = await axios.post(refreshUrl, {
      grant_type: 'refresh_token',
      refresh_token: refreshT,
    });
    // Sets the appropriate cookies after refreshing access token
    setCookie(cookieKeys.ACCESS_TOKEN, idToken, cookieConfig);
    return idToken;
  }
  return null;
};

/**
 * Logs a user in with email and password
 * @param {string} email The email to log in with
 * @param {string} password The password to log in with
 * @param {string} redirectPath The path to redirect the user to after logging out
 * @param {hook} navigate An instance of the useNavigate hook from react-router-dom
 * @param {Cookies} cookies The user's cookies to populate
 * @returns A boolean indicating whether or not the log in was successful
 */
const logInWithEmailAndPassword = async (email, password, redirectPath, navigate, cookies) => {
  // Check if user is stored in database before logging them in.
  const user = await FYABackend.get(`/users/email/${email}`);
  if (user.data.user) {
    await signInWithEmailAndPassword(auth, email, password);
    cookies.set(cookieKeys.ACCESS_TOKEN, auth.currentUser.accessToken, cookieConfig);
    navigate(redirectPath);
  } else {
    throw new Error(`User with email ${email} is not stored in the database.`);
  }
};

/**
 * Registers a new user using the email provider
 * @param {string} email
 * @param {string} password
 * @param {hook} navigate An instance of the useNavigate hook from react-router-dom
 * @param {string} redirectPath path to redirect users once logged in
 */
const registerWithEmailAndPassword = async (firstName, lastName, email, password) => {
  await FYABackend.post('/users/create', {
    firstName,
    lastName,
    email,
    password,
  });
  await FYABackend.delete(`/adminInvite/${email}`);
};

/**
 * Sends a password reset email given an email
 * @param {string} email The email to resend password to
 */
const sendPasswordReset = async email => {
  await sendPasswordResetEmail(auth, email);
};

/**
 * Sends password reset to new account created with stated email
 * @param {string} email The email to create an account with
 */
const sendInviteLink = async email => {
  const inviteId = nanoid();
  const url = `${process.env.REACT_APP_BASE_URL}/auth-email?mode=inviteUser&inviteID=${inviteId}`;
  const currentUserId = await getCurrentUser(auth);
  const currentUserInDB = await FYABackend.get(`/users/userId/${currentUserId.uid}`);
  await sendEmail(
    email,
    email,
    <AdminInviteEmail url={url} senderName={currentUserInDB.data.user.first_name} />,
    'Find Your Anchor Launch Map - Registration',
  );

  // Add invited user to the AdminInvite table after the invite email has been sent.
  await FYABackend.post('/adminInvite', { email, inviteId });
};

/**
 * Completes the password reset process, given a confirmation code and new password
 * @param {string} code The confirmation code sent via email to the user
 * @param {string} newPassword The new password
 */
const confirmNewPassword = async (code, newPassword) => {
  await confirmPasswordReset(auth, code, newPassword);
};

/**
 * Logs a user out
 * @param {string} redirectPath The path to redirect the user to after logging out
 * @param {hook} navigate An instance of the useNavigate hook from react-router-dom
 */
const logout = async cookies => {
  await signOut(auth);
  clearCookies(cookies);
};

// /**
//  * Adds an axios interceptor for auth to given axiosInstance
//  * @param {AxiosInstance} axiosInstance instance of axios to apply interceptor to
//  * Reference utils.js for axios instance
//  */
// const addAuthInterceptor = axiosInstance => {
//   // This response interceptor will refresh the user's access token using the refreshToken helper method
//   axiosInstance.interceptors.response.use(
//     response => {
//       return response;
//     },
//     async error => {
//       if (error.response) {
//         const { status, data } = error.response;
//         console.log('hello wtf');
//         switch (status) {
//           case 400:
//             // check if 400 error was token
//             if (data === '@verifyToken no access token') {
//               // token has expired;
//               try {
//                 // attempting to refresh token;
//                 await refreshToken();
//                 // token refreshed, reattempting request;
//                 const { config } = error.response;
//                 // configure new request in a new instance;
//                 return await axios({
//                   method: config.method,
//                   url: `${config.baseURL}${config.url}`,
//                   data: config.data,
//                   params: config.params,
//                   headers: config.headers,
//                   withCredentials: true,
//                 });
//               } catch (e) {
//                 return Promise.reject(e);
//               }
//             } else {
//               return Promise.reject(error);
//             }
//           default:
//             return Promise.reject(error);
//         }
//       } else if (error.request) {
//         // The request was made but no response was received
//         // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
//         // http.ClientRequest in node.js
//         return Promise.reject(error);
//       } else {
//         // Something happened in setting up the request that triggered an Error
//         return Promise.reject(error);
//       }
//     },
//   );
// };

// addAuthInterceptor(FYABackend);

export {
  auth,
  useNavigate,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  // addAuthInterceptor,
  sendPasswordReset,
  logout,
  refreshToken,
  getCurrentUser,
  sendInviteLink,
  confirmNewPassword,
};
