import React from 'react';
import PropTypes from 'prop-types';
import { Input, FormControl, FormLabel, FormErrorMessage, FormHelperText } from '@chakra-ui/react';
import styles from './Input.module.css';

const TextInput = ({ error, register, type, placeholder, title, isEditable }) => {
  return (
    <FormControl className={styles['form-control']} isInvalid={error}>
      <FormLabel className={styles['form-title']}>{title}</FormLabel>
      <Input type={type} placeholder={placeholder} {...register} isDisabled={!isEditable} />
      <div className={styles['input-tools']}>
        {!error && <FormHelperText>&nbsp;</FormHelperText>}
        <FormErrorMessage isInvalid className={styles['form-error-message']}>
          {error?.message} &nbsp;
        </FormErrorMessage>
      </div>
    </FormControl>
  );
};

TextInput.propTypes = {
  error: PropTypes.shape({ message: PropTypes.string }),
  register: PropTypes.shape({ email: PropTypes.string }).isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  title: PropTypes.string,
  isEditable: PropTypes.bool,
};
TextInput.defaultProps = {
  error: null,
  placeholder: '',
  title: '',
  isEditable: true,
};

export default TextInput;
