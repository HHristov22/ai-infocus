import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Box } from '@mui/material';

export default function Layout({ children, darkMode, toggleDarkMode }) {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh' 
    }}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
