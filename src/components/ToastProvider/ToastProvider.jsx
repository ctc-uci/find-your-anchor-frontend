import React, { useContext, createContext } from 'react';
import { useToast, Heading, Text, IconButton, ChakraProvider } from '@chakra-ui/react';
import { PropTypes } from 'prop-types';
import { CheckCircleIcon, CloseIcon, InfoIcon, WarningTwoIcon, Icon } from '@chakra-ui/icons';
import useMobileWidth from '../../common/useMobileWidth';

import styles from './ShowToast.module.css';

const ToastContext = createContext();

const useCustomToast = () => {
  return useContext(ToastContext);
};

const ToastProvider = ({ children }) => {
  const toast = useToast();
  const isMobile = useMobileWidth();

  const showToast = toastData => {
    const { type, title, message, toastPosition } = toastData;
    let bgColor;
    let statusIcon;
    switch (type) {
      case 'info':
        bgColor = 'var(--color-request-changes)';
        statusIcon = InfoIcon;
        break;
      case 'error':
        bgColor = 'var(--color-warning)';
        statusIcon = WarningTwoIcon;
        break;
      case 'success':
        bgColor = 'var(--color-success)';
        statusIcon = CheckCircleIcon;
        break;
      default:
        bgColor = 'var(--color-request-changes)';
        statusIcon = InfoIcon;
    }

    toast({
      position: isMobile ? 'top' : toastPosition,
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

  const value = {
    showToast,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { useCustomToast, ToastProvider };
