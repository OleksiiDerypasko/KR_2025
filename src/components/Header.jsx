import React from 'react';
import { useSlae } from '../context/SlaeContext';
import { Box, Flex, Heading, Select, IconButton, useColorMode } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const Header = () => {
  const { state, dispatch } = useSlae();
  const { language } = state;
  const { colorMode, toggleColorMode } = useColorMode();

  const setLanguage = (lang) => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
  };

  return (
    <Box as="header" bg="teal.500" color="white" p={4}>
      <Flex justify="space-between" align="center">
        <Heading as="h1" size="md">SLAE Solver</Heading>
        <Flex align="center">
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            mr={4}
            color="black"
            bg="white"
            borderColor="gray.300"
          >
            <option value="uk">Українська</option>
            <option value="en">English</option>
          </Select>
          <IconButton
            aria-label="Toggle dark mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;