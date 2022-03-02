/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloseIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';
import styles from './CSVDropZone.module.css';
import DropZoneIcon from '../../../assets/upload.png';

function CSVDropZone({ setFile }) {
  const { getRootProps, getInputProps, acceptedFiles, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: 'text/csv',
    maxFiles: 1,
  });
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setUploaded(true);
      setFile(acceptedFiles[0]);
    }
  });

  const removeUploadedPhoto = () => {
    acceptedFiles.pop();
    setUploaded(false);
    setFile();
  };

  const acceptedFileItems = acceptedFiles.map(acceptedFile => (
    <li key={acceptedFile.path} className={styles['file-item']}>
      <button
        className={styles['file-item-span']}
        type="button"
        aria-label="Remove"
        onClick={removeUploadedPhoto}
      >
        <CloseIcon w={4} h={4} color="gray.400" />
      </button>
      <span className={styles['file-item-span']}>{acceptedFile.path}</span>
    </li>
  ));

  return (
    <>
      {!uploaded ? (
        <div
          className={`${styles['dropzone-content']} ${styles['dropzone-zone']}`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <div className={styles['upload-icon']} />
          <img src={DropZoneIcon} alt="Icon" className={styles['dropzone-icon']} />
          <div>
            <button type="button" className={styles['file-selector']} onClick={open}>
              Click
            </button>
            <span className={styles['dropzone-text']}>/drag file to upload</span>
          </div>
        </div>
      ) : (
        <div className={styles['dropzone-content']}>
          <ul className={styles['files-list']}>{acceptedFileItems}</ul>
        </div>
      )}
    </>
  );
}

CSVDropZone.propTypes = {
  setFile: PropTypes.func.isRequired,
};

export default CSVDropZone;
