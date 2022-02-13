/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloseIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';
import './DropZone.css';

function DropZone({ setFile }) {
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
    <li key={acceptedFile.path} className="file-item">
      <button
        className="file-item-span"
        type="button"
        aria-label="Remove"
        onClick={removeUploadedPhoto}
      >
        <CloseIcon w={4} h={4} color="gray.400" />
      </button>
      <span className="file-item-span">{acceptedFile.path}</span>
    </li>
  ));

  return (
    <>
      {!uploaded ? (
        <div className="dropzone-zone" {...getRootProps()}>
          <input {...getInputProps()} />
          <button type="button" className="fileSelector" onClick={open}>
            Click
          </button>
          <span className="dropzone-text">/drag file to upload</span>
        </div>
      ) : (
        <div>
          <ul className="files-list">{acceptedFileItems}</ul>
        </div>
      )}
    </>
  );
}

DropZone.propTypes = {
  setFile: PropTypes.func.isRequired,
};

export default DropZone;
