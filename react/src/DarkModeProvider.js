import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const DarkModeProvider = ({ children }) => {
  return (
    <ThemeProvider theme={darkTheme}>
        {children}
    </ThemeProvider>
  )
};

export default DarkModeProvider;
