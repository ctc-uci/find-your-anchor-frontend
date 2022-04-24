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
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import styles from './CommonAccordionSelector.module.css';

function RadioCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
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
const CommonAccordionSelector = ({ headerText, options, isHeader }) => {
  // const options = [
  //   'Ascending Box Number',
  //   'Ascending Zip Code',
  //   'Chronologically',
  //   'Descending Box Number',
  //   'Descending Zip Code',
  // ];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    defaultValue: 'react',
    onChange: console.log,
  });

  const group = getRootProps();

  if (isHeader) {
    return (
      <Accordion allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Text className={styles['csv-form-labels']}>{headerText}</Text>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <VStack align="left" {...group}>
              {options.map(value => {
                const radio = getRadioProps({ value });
                return (
                  <RadioCard key={value} {...radio}>
                    {value}
                  </RadioCard>
                );
              })}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
  }
  return (
    <Accordion allowMultiple>
      <AccordionItem>
        <AccordionButton>
          <Text>{headerText}</Text>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <VStack align="left" {...group}>
            {options.map(value => {
              const radio = getRadioProps({ value });
              return (
                <RadioCard key={value} {...radio}>
                  {value}
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
};

CommonAccordionSelector.propTypes = {
  headerText: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.array.isRequired,
  isHeader: PropTypes.bool,
};

export default CommonAccordionSelector;
