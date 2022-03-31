import React from 'react';
import { IconButton, ChakraProvider, Heading, Text, useToast } from '@chakra-ui/react';
import { CheckCircleIcon, CloseIcon, InfoIcon, WarningTwoIcon, Icon } from '@chakra-ui/icons';
import styles from './CustomToast.module.css';

const CustomToast = ({ icon, title, message, toastPosition }) => {
  let bgColor;
  let statusIcon;
  const toast = useToast();
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

  return () => {
    return toast({
      position: toastPosition,
      duration: 3000,
      isClosable: true,
      render: () => (
        <ChakraProvider>
          <div
            className={styles['custom-toast-wrapper']}
            style={{
              backgroundColor: bgColor,
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
                <IconButton
                  className={styles['custom-toast-exit-button']}
                  icon={<CloseIcon />}
                  w={3}
                  h={3}
                  onClick={() => {
                    toast.closeAll();
                  }}
                  variant="ghost"
                />
              </div>
            </div>
          </div>
        </ChakraProvider>
      ),
    });
  };
};

export default CustomToast;
