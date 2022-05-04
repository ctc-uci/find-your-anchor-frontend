/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import {
  Text,
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  AccordionButton,
  Box,
  useRadio,
  useRadioGroup,
  VStack,
  HStack,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import styles from './CommonAccordionSelector.module.css';

function RadioCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label" onClick={() => props.openAdditionalValueInput()}>
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        _checked={{
          bg: 'teal.600',
          color: 'white',
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
}

// Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
const CommonAccordionSelector = ({
  headerText,
  options,
  isHeader,
  isInPlane,
  setValue,
  setAdditionalValueInput,
}) => {
  const { value, getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    defaultValue: 'react',
    onChange: setValue,
  });

  const group = getRootProps();

  return (
    <Accordion allowMultiple>
      <AccordionItem>
        <h2>
          <AccordionButton>
            {value === 'react' ? (
              <Box>
                {isHeader ? (
                  <Box display="flex" mt="2" alignItems="center" justify="space-between">
                    <Text className={styles['csv-form-labels']}>{headerText}</Text>
                    <AccordionIcon />
                  </Box>
                ) : (
                  <Box display="flex" mt="2" alignItems="center" justify="space-between">
                    <Text>{headerText}</Text>
                    <AccordionIcon />
                  </Box>
                )}
              </Box>
            ) : (
              <Box>
                {isInPlane ? (
                  <HStack className={styles['header-container']}>
                    {isHeader ? (
                      <Box display="flex" mt="2" alignItems="center" justify="space-between">
                        <Text className={styles['csv-form-labels']}>{headerText}</Text>
                      </Box>
                    ) : (
                      <Box display="flex" mt="2" alignItems="center" justify="space-between">
                        <Text>{headerText}</Text>
                      </Box>
                    )}
                    <HStack>
                      <Text>{options.find(option => option.value === value).name}</Text>
                      <AccordionIcon />
                    </HStack>
                  </HStack>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {isHeader ? (
                      <Box display="flex" mt="2" alignItems="center" justify="space-between">
                        <Text className={styles['csv-form-labels']}>{headerText}</Text>
                      </Box>
                    ) : (
                      <Box display="flex" mt="2" alignItems="center" justify="space-between">
                        <Text>{headerText}</Text>
                      </Box>
                    )}
                    <div className={styles['header-selection-container']}>
                      <Text>{options.find(option => option.value === value).name}</Text>
                      <AccordionIcon />
                    </div>
                  </VStack>
                )}
              </Box>
            )}
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <VStack align="left" {...group}>
            {options.map(option => {
              const radio = getRadioProps({ value: option.value });
              return (
                <RadioCard
                  key={option.value}
                  value={option.value}
                  {...radio}
                  openAdditionalValueInput={setAdditionalValueInput}
                >
                  {option.name}
                </RadioCard>
              );
            })}
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

CommonAccordionSelector.defaultProps = {
  isHeader: true,
  isInPlane: false,
};

CommonAccordionSelector.propTypes = {
  headerText: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.array.isRequired,
  isHeader: PropTypes.bool,
  isInPlane: PropTypes.bool,
};

export default CommonAccordionSelector;
