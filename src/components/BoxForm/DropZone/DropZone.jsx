/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useMemo, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloseIcon } from '@chakra-ui/icons';
import './DropZone.css';

function DropZone({ setFiles }) {
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
    let base = 'dropzone-zone';
    base += isDragAccept ? ' dropzone-accept' : '';
    base += isDragReject ? ' dropzone-reject' : '';
    return base;
  }, [isDragReject, isDragAccept]);

  const removeUploadedPhoto = () => {
    acceptedFiles.pop();
    setUploaded(false);
    setFiles([]);
  };

  const acceptedFileItems = acceptedFiles.map(acceptedFile => (
    <li key={acceptedFile.path} className="file-item">
      <button type="button" aria-label="Remove" onClick={removeUploadedPhoto}>
        <CloseIcon w={4} h={4} color="gray.400" />
      </button>
      <span>{acceptedFile.path}</span>
    </li>
  ));

  return (
    <>
      {!uploaded ? (
        <div className={dropzoneBox} {...getRootProps()}>
          <input {...getInputProps()} />
          <button type="button" className="fileSelector" onClick={open}>
            Click
          </button>
          <span className="dropzone-text">/drag file to upload</span>
          <p className="dropzone-support-text">Support for jpeg, jpg, png</p>
        </div>
      ) : (
        <div>
          <ul className="files-list">{acceptedFileItems}</ul>
        </div>
      )}
    </>
  );
}

export default DropZone;