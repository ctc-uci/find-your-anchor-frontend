/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloseIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';
import styles from './CSVDropZone.module.css';
import DropZoneIcon from '../../../assets/upload.png';
import useMobileWidth from '../../../common/useMobileWidth';

function CSVDropZone({ setFile }) {
  const isMobile = useMobileWidth();
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
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
        {isMobile ? (
          <CloseIcon w={5} h={5} color="gray.400" />
        ) : (
          <CloseIcon w={4} h={4} color="gray.400" />
        )}
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
          <div className={styles['dropzone-text']}>
            <span>Click or drag to upload CSV file</span>
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
