import React from 'react';
import PropTypes from 'prop-types';
import {
  Td,
  Tr,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Tooltip,
  Checkbox,
  Flex,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckIcon, CloseIcon, DeleteIcon, EditIcon, WarningIcon } from '@chakra-ui/icons';
import DatePicker from 'react-datepicker';
import BoxSchema from '../../UploadCSV/UploadCSVUtils';
import DeleteBoxModal from '../DeleteBoxModal/DeleteBoxModal';
import styles from './ReadOnlyRow.module.css';
import useMobileWidth from '../../../common/useMobileWidth';

const ReadOnlyRow = ({ data, editRow, handleDeleteRow, isError }) => {
  const isMobile = useMobileWidth();

  const {
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(BoxSchema),
    defaultValues: {
      date: data.values.date,
      boxNumber: data.values.boxNumber,
      zipCode: data.values.zipCode,
      country: data.values.country,
      launchedOrganically: data.values.launchedOrganically,
    },
    delayError: 750,
  });

  const {
    isOpen: isOpenDeleteModal,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();

  const onDelete = () => {
    handleDeleteRow(data.original.id);
    onCloseDeleteModal();
  };

  const datePickerForm = () => {
    return (
      <FormControl isInvalid={errors?.date}>
        <FormLabel>Date</FormLabel>
        <InputGroup>
          <Controller
            control={control}
            name="date"
            // eslint-disable-next-line no-unused-vars
            render={({ field: { onChange, value, ref } }) => {
              const date = new Date(value);
              return (
                <DatePicker
                  placeholderText="MM/DD/YYYY"
                  className={
                    errors?.date
                      ? `${styles['date-picker']} ${styles['date-picker-error']}`
                      : styles['date-picker']
                  }
                  type="date"
                  selected={Number.isNaN(Date.parse(date)) ? undefined : date}
                  onChange={onChange}
                  readOnly
                />
              );
            }}
          />
          {errors?.date && (
            <Tooltip hasArrow label={errors.date?.message} bg="red.600">
              <InputRightElement className={styles['input-right-warning']}>
                <WarningIcon />
              </InputRightElement>
            </Tooltip>
          )}
        </InputGroup>
      </FormControl>
    );
  };

  const boxNumberForm = () => {
    return (
      <FormControl isReadOnly isInvalid={errors?.boxNumber}>
        <FormLabel>Box Number</FormLabel>
        <InputGroup>
          <Input id="boxNumber" placeholder="12345" name="boxNumber" {...register('boxNumber')} />
          {errors?.boxNumber && (
            <Tooltip hasArrow label={errors.boxNumber?.message} bg="red.600">
              <InputRightElement className={styles['input-right-warning']}>
                <WarningIcon />
              </InputRightElement>
            </Tooltip>
          )}
          ;
        </InputGroup>
      </FormControl>
    );
  };

  const zipCodeForm = () => {
    return (
      <FormControl isReadOnly isInvalid={errors?.zipCode}>
        <FormLabel>Zip Code</FormLabel>
        <InputGroup>
          <Input id="zipCode" placeholder="e.g. 90210" name="zipCode" {...register('zipCode')} />
          {errors?.zipCode && (
            <Tooltip hasArrow label={errors.zipCode?.message} bg="red.600">
              <InputRightElement className={styles['input-right-warning']}>
                <WarningIcon />
              </InputRightElement>
            </Tooltip>
          )}
          ;
        </InputGroup>
      </FormControl>
    );
  };

  const countryForm = () => {
    return (
      <FormControl isReadOnly isInvalid={errors['']?.message}>
        <FormLabel>Country</FormLabel>
        <InputGroup>
          <Input id="country" placeholder="e.g. 90210" name="country" {...register('country')} />
          {errors['']?.message && (
            <Tooltip hasArrow label={errors['']?.message} bg="red.600">
              <InputRightElement className={styles['input-right-warning']}>
                <WarningIcon />
              </InputRightElement>
            </Tooltip>
          )}
          ;
        </InputGroup>
      </FormControl>
    );
  };

  if (!isMobile) {
    return (
      <Tr key={data.id} id={data.id} className={isError && styles['csv-error']}>
        <Td>{data.values.date}</Td>
        <Td>{data.values.boxNumber}</Td>
        <Td>{data.values.zipCode}</Td>
        <Td>{data.values.country}</Td>
        <Td>
          {data.values.launchedOrganically ? (
            <CheckIcon alt="Green Check Icon" className={styles['green-check-icon']} />
          ) : (
            <CloseIcon alt="Red Cross Icon" className={styles['red-cross-icon']} />
          )}
        </Td>
        <Td>
          <DeleteBoxModal
            isOpen={isOpenDeleteModal}
            onClose={onCloseDeleteModal}
            onDelete={onDelete}
          />
          <button type="button" onClick={e => editRow(e, data, -1, true)}>
            <EditIcon alt="Edit Icon" className={styles['edit-icon']} />
          </button>
          <button type="button" onClick={onOpenDeleteModal}>
            <DeleteIcon alt="Delete Icon" className={styles['delete-icon']} />
          </button>
        </Td>
      </Tr>
    );
  }

  return (
    <Flex flexDirection="column" gap="20px" margin="0 30px">
      {boxNumberForm()}
      {datePickerForm()}
      {zipCodeForm()}
      {countryForm()}

      <FormControl isReadOnly display="flex" gap="10px" justify="flex-start" alignItems="baseline">
        <Checkbox name="launchedOrganically" {...register('launchedOrganically')} />
        <FormLabel>Launched Organically?</FormLabel>
      </FormControl>

      <Flex justifyContent="flex-end" gap="30px">
        <DeleteBoxModal
          isOpen={isOpenDeleteModal}
          onClose={onCloseDeleteModal}
          onDelete={onDelete}
        />
        <button type="button" onClick={e => editRow(e, data, -1, true)}>
          <EditIcon w={6} h={6} alt="Edit Icon" />
        </button>
        <button type="button" onClick={onOpenDeleteModal}>
          <DeleteIcon color="#E53E3E" w={6} h={6} alt="Delete Icon" />
        </button>
      </Flex>
    </Flex>
  );
};

ReadOnlyRow.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    values: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      date: PropTypes.string,
      boxNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      zipCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      country: PropTypes.string,
      launchedOrganically: PropTypes.bool,
    }),
    original: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      date: PropTypes.string,
      boxNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      zipCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      country: PropTypes.string,
      launchedOrganically: PropTypes.bool,
    }),
  }).isRequired,
  editRow: PropTypes.func.isRequired,
  handleDeleteRow: PropTypes.func.isRequired,
  isError: PropTypes.bool.isRequired,
};

export default ReadOnlyRow;
