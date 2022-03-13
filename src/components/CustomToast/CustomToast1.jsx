//  ignore this file
import React, { useRef, useEffect, useState } from 'react';
import { IconButton, Heading, Text } from '@chakra-ui/react';
import { CheckCircleIcon, CloseIcon, InfoIcon, WarningTwoIcon, Icon } from '@chakra-ui/icons';

import styles from './CustomToast.module.css';

const CustomToast = () => {
  const title = 'test';
  const icon = 'info';
  const message = 'test';
  let bgColor;
  let statusIcon;

  switch (icon) {
    case 'info':
      bgColor = '#DD6B20';
      statusIcon = InfoIcon;
      break;
    case 'error':
      bgColor = '#E53E3E';
      statusIcon = WarningTwoIcon;
      break;
    case 'success':
      bgColor = '#38A169';
      statusIcon = CheckCircleIcon;
      break;
    default:
      bgColor = '#DD6B20';
      statusIcon = InfoIcon;
  }
  const inputRef = useRef(null);
  const [ToastWidth, setToastWidth] = useState(0);
  useEffect(() => {
    if (inputRef.current) {
      setToastWidth(inputRef.current.parentElement.clientWidth);
    }
  }, [inputRef]);
  useEffect(() => {
    console.log(ToastWidth);
  }, [ToastWidth]);

  return (
    <div
      ref={inputRef}
      className={styles['custom-toast-wrapper']}
      style={{
        backgroundColor: bgColor,
        width: ToastWidth,
      }}
    >
      <div className={styles['custom-toast-content']}>
        <div className={styles['custom-toast-icon']}>
          <Heading className={styles['custom-toast-message-header']} as="h4" size="md">
            <Icon as={statusIcon} w={5} h={5} />
          </Heading>
        </div>
        <div className={styles['custom-toast-message']}>
          <Heading className={styles['custom-toast-message-header']} as="h4" size="md">
            {title}
          </Heading>

          <Text>{message}</Text>
        </div>
        <div className={styles['custom-toast-exit']} align="right">
          <IconButton icon={<CloseIcon />} w={3} h={3} variant="ghost" />
        </div>
      </div>
    </div>
  );
};

export default CustomToast;
