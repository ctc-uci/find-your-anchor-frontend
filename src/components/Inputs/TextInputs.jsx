import React from 'react';
import PropTypes from 'prop-types';
import { Input, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import styles from './Input.module.css';

const TextInput = ({ error, register, type, placeholder, title }) => {
  return (
    <FormControl className={styles['form-control']} isInvalid={error}>
      <FormLabel className={styles['form-title']}>{title}</FormLabel>
      <Input type={type} placeholder={placeholder} {...register} />
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
};

TextInput.propTypes = {
  error: PropTypes.shape({ message: PropTypes.string }),
  register: PropTypes.shape({ email: PropTypes.string }).isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  title: PropTypes.string,
};
TextInput.defaultProps = {
  error: null,
  placeholder: '',
  title: '',
};

export default TextInput;
