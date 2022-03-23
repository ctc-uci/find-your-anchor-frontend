/* eslint-disable react/jsx-props-no-spreading */

import React, { useMemo, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloseIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';
import { BsUpload } from 'react-icons/bs';
import styles from './AddBoxDropZone.module.css';

const AddBoxDropZone = ({ setFiles }) => {
  const { getRootProps, getInputProps, isDragAccept, isDragReject, acceptedFiles, open } =
    useDropzone({
      noClick: true,
      noKeyboard: true,
      accept: 'image/jpeg, image/jpg, image/png',
      maxFiles: 1,
    });
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setUploaded(true);
      setFiles(acceptedFiles);
    }
  });

  const dropzoneBox = useMemo(() => {
    if (isDragAccept) {
      return 'dropzone-accept';
    }
    if (isDragReject) {
      return 'dropzone-reject';
    }
    return '';
  }, [isDragReject, isDragAccept]);

  const removeUploadedPhoto = () => {
    acceptedFiles.pop();
    setUploaded(false);
    setFiles([]);
  };

  const acceptedFileItems = acceptedFiles.map(acceptedFile => (
    <li key={acceptedFile.path} className={styles['file-item']}>
      <button
        className={styles['file-item-span']}
        type="button"
        aria-label="Remove"
        onClick={removeUploadedPhoto}
      >
        <CloseIcon w={3} h={3} color="gray.600" />
      </button>
      <span className={styles['file-item-span-text']}>{acceptedFile.path}</span>
    </li>
  ));

  return (
    <>
      {!uploaded ? (
        <div className={`${styles['dropzone-zone']} ${styles[dropzoneBox]}`} {...getRootProps()}>
          <input {...getInputProps()} />
          <BsUpload className={styles['dropzone-icon']} />
          <button type="button" className={styles['file-selector']} onClick={open}>
            Click
          </button>
          <span className={styles['dropzone-text']}>/drag file to upload</span>
          <p className={styles['dropzone-support-text']}>Support for jpeg, jpg, png</p>
        </div>
      ) : (
        <div>
          <ul className={styles['files-list']}>{acceptedFileItems}</ul>
        </div>
      )}
    </>
  );
};

AddBoxDropZone.propTypes = {
  setFiles: PropTypes.func.isRequired,
};

export default AddBoxDropZone;
