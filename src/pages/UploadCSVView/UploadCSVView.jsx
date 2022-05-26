import { Flex, IconButton, Text } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CSVViewTable from '../../components/UploadCSVView/CSVViewTable/CSVViewTable';
import useMobileWidth from '../../common/useMobileWidth';

const UploadCSVView = () => {
  const isMobile = useMobileWidth();
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <Flex direction="column" margin="30px">
        <Text color={isMobile && 'var(--color-hyperlink)'} textStyle="subheader">
          {state.filename}
        </Text>
        <Flex ml={-2}>
          {isMobile && (
            <IconButton
              background="transparent"
              color="var(--color-black)"
              icon={<ChevronLeftIcon h={9} w={9} />}
              onClick={() => navigate('/')}
            />
          )}
        </Flex>
        <CSVViewTable
          rows={state.rows}
          boxNumberMap={state.boxNumberMap}
          CSVFilename={state.filename}
        />
      </Flex>
    </>
  );
};

export default UploadCSVView;
