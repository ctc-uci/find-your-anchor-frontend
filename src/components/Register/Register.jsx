import React, { useState } from 'react';
import { instanceOf } from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Cookies, withCookies } from '../../common/cookie_utils';
import { registerWithEmailAndPassword, signInWithGoogle } from '../../common/auth_utils';

const Register = ({ cookies }) => {
  const [email, setEmail] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [password, setPassword] = useState();
  const [checkPassword, setCheckPassword] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (password !== checkPassword) {
        throw new Error("Passwords don't match");
      }
      await registerWithEmailAndPassword(firstName, lastName, email, password, navigate, '/');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  /**
   * This function handles signing up with Google
   * If the user logs in and is new, they are directed to a new-user path
   * If the user logs in and isn't new, they are directed to the dashboard.
   * If the user fails to log in, they are directed back to the login screen
   */
  const handleGoogleSignIn = async e => {
    try {
      e.preventDefault();
      await signInWithGoogle('/new-user', '/logout', navigate, cookies);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={({ target }) => setFirstName(target.value)}
          placeholder="First Name"
        />
        <br />
        <input
          type="text"
          onChange={({ target }) => setLastName(target.value)}
          placeholder="Last Name"
        />
        <br />
        <input type="text" onChange={({ target }) => setEmail(target.value)} placeholder="Email" />
        <br />
        <input
          onChange={({ target }) => setPassword(target.value)}
          placeholder="Password"
          type="password"
        />
        <br />
        <input
          onChange={({ target }) => setCheckPassword(target.value)}
          placeholder="Re-enter Password"
          type="password"
        />
        <br />
        <button type="submit">Register</button>
        <div className="login-buttons">
          <button type="button" onClick={handleGoogleSignIn}>
            <span>Sign Up With Google</span>
          </button>
        </div>
      </form>
      <p>{errorMessage}</p>
    </div>
  );
};

Register.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Register);
