import React from 'react';
import { Flex, Text, Tooltip, IconButton, Box, Input } from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon, ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';
import useMobileWidth from '../useMobileWidth';

const TablePagination = ({ pageLength, pageIndex, pageCount, pageControl }) => {
  const { gotoPage, nextPage, previousPage, canNextPage, canPreviousPage } = pageControl;
  const isMobile = useMobileWidth();

  return (
    <Box>
      <Flex justifyContent="space-between" m={4} alignItems="center">
        <Flex alignItems="center">
          <Tooltip label="First Page">
            <IconButton
              background="transparent"
              color="var(--color-black)"
              icon={<ArrowLeftIcon h={6} w={6} />}
              isDisabled={!canPreviousPage}
              variant="noHover"
              onClick={() => gotoPage(0)}
            />
          </Tooltip>
        </Flex>

        <Flex justifyContent="space-between" m={4} alignItems="center">
          <Tooltip label="Previous Page">
            <IconButton
              background="transparent"
              color="var(--color-black)"
              icon={<ChevronLeftIcon h={9} w={9} />}
              isDisabled={!canPreviousPage}
              variant="noHover"
              onClick={() => previousPage()}
            />
          </Tooltip>
          <Text flexShrink="0" ml={4} mr={2}>
            <Text as="span" textStyle="body">
              Page
            </Text>
            <Text as="span" color="var(--color-black)" textStyle="body">
              {' '}
              {pageIndex + 1} of {pageLength}
            </Text>
          </Text>
          {!isMobile && (
            <Text textStyle="body">
              | Go to page:
              <Input
                type="number"
                value={pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
                ml="10px"
                size="md"
                textAlign="center"
                width="70px"
              />
            </Text>
          )}{' '}
          <Tooltip label="Next Page">
            <IconButton
              background="transparent"
              color="var(--color-black)"
              icon={<ChevronRightIcon h={9} w={9} />}
              isDisabled={!canNextPage}
              variant="noHover"
              onClick={() => nextPage()}
            />
          </Tooltip>
        </Flex>

        <Flex alignItems="center">
          <Tooltip label="Last Page">
            <IconButton
              background="transparent"
              color="var(--color-black)"
              icon={<ArrowRightIcon h={6} w={6} />}
              isDisabled={!canNextPage}
              variant="noHover"
              onClick={() => gotoPage(pageCount - 1)}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  );
};

TablePagination.propTypes = {
  pageLength: PropTypes.number.isRequired,
  pageIndex: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  pageControl: PropTypes.exact({
    gotoPage: PropTypes.func,
    nextPage: PropTypes.func,
    previousPage: PropTypes.func,
    canNextPage: PropTypes.bool,
    canPreviousPage: PropTypes.bool,
  }).isRequired,
};

export default TablePagination;
