import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@chakra-ui/react';
import styles from './DeleteBoxModalContent.module.css';

const DeleteBoxModalContent = ({ deleteBox, deleteTransaction }) => (
  <div className={styles['content-wrapper']}>
    <h1 className={styles.title}>Delete Box</h1>
    <div className={styles.body}>
      Do you want to delete the entire box or just the last transaction?
    </div>
    <div className={styles.buttons}>
      <Button type="button" fontWeight="semibold" onClick={deleteTransaction}>
        Delete Last Transaction
      </Button>
      <Button type="button" onClick={deleteBox} colorScheme="red" fontWeight="semibold">
        Delete Entire Box
      </Button>
    </div>
  </div>
);

DeleteBoxModalContent.propTypes = {
  deleteBox: PropTypes.func.isRequired,
  deleteTransaction: PropTypes.func.isRequired,
};

export default DeleteBoxModalContent;
