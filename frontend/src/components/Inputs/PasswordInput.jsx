import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Icon,
  FormErrorMessage,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import styles from './Input.module.css';

const PasswordInput = ({ error, register, showForgotPassword, title }) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <FormControl className={styles['form-control']} isInvalid={error}>
      <FormLabel className={styles['form-title']}>{title}</FormLabel>
      <InputGroup>
        <Input
          type={show ? 'text' : 'password'}
          placeholder="Password must be at least 8 characters"
          {...register}
        />
        <InputRightElement className={styles['password-show-hide']}>
          <Button className={styles['password-show-hide-button']} size="sm" onClick={handleClick}>
            {show ? <Icon as={ViewIcon} /> : <Icon as={ViewOffIcon} />}
          </Button>
        </InputRightElement>
      </InputGroup>
      <div className={styles['input-tools']}>
        <div className={styles['form-error-wrapper']}>
          {!error && <FormHelperText>&nbsp;</FormHelperText>}
          <FormErrorMessage className={styles['form-error-message']}>
            {error?.message}
          </FormErrorMessage>
        </div>
        {showForgotPassword && (
          <div className={styles['forgot-password-wrapper']} align="right">
            <Link className={styles['forgot-password']} to="/forgot-password">
              Forgot Password?
            </Link>
          </div>
        )}
      </div>
    </FormControl>
  );
};

PasswordInput.propTypes = {
  error: PropTypes.shape({ message: PropTypes.string }),
  register: PropTypes.shape({ password: PropTypes.string }).isRequired,
  showForgotPassword: PropTypes.bool,
  title: PropTypes.string,
};
PasswordInput.defaultProps = {
  error: null,
  showForgotPassword: false,
  title: 'Password',
};

export default PasswordInput;
