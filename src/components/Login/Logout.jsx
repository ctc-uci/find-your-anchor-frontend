import React, { useState } from 'react';
import { instanceOf } from 'prop-types';
import { logout, useNavigate } from '../../common/auth_utils';
import { Cookies, withCookies } from '../../common/cookie_utils';
import { FYABackend } from '../../common/utils';

const Logout = ({ cookies }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState();
  const handleSubmit = async () => {
    try {
      await logout('/', navigate, cookies);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleSubmit2 = async () => {
    await FYABackend.get('/s3Upload');
  };

  return (
    <div>
      <h2>Logout</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <button type="submit" onClick={handleSubmit}>
        Logout
      </button>
      <button type="submit" onClick={handleSubmit2}>
        Click me
      </button>
    </div>
  );
};

Logout.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(Logout);
