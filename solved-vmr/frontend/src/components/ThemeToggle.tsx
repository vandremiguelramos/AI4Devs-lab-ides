import React from 'react';
import {
  IconButton,
  useColorMode,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

const ThemeToggle: React.FC = () => {
  const { toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(MoonIcon, SunIcon);
  const nextMode = useColorModeValue('dark', 'light');

  return (
    <Tooltip 
      label={`Switch to ${nextMode} mode`}
      aria-label={`Switch to ${nextMode} mode`}
      hasArrow
    >
      <IconButton
        size="md"
        fontSize="lg"
        variant="ghost"
        color="current"
        marginLeft="2"
        onClick={toggleColorMode}
        icon={<SwitchIcon />}
        aria-label={`Switch to ${nextMode} mode`}
        _hover={{
          bg: useColorModeValue('gray.200', 'gray.700'),
        }}
      />
    </Tooltip>
  );
};

export default ThemeToggle; 