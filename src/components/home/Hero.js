import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Container } from '@mui/material';

const Hero = () => {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(45deg, #106EBE 30%, #0091EA 90%)',
        color: 'white',
        textAlign: 'center',
        py: 8
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              mb: 4,
              fontFamily: 'Righteous',
              fontSize: { xs: '2rem', md: '3.75rem' }
            }}
          >
            Welcome to AI-INFOCUS
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3,
              opacity: 0.9,
              lineHeight: 1.8,
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}
          >
            Your Gateway to the Latest AI News and Innovations
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              maxWidth: '800px',
              mx: 'auto',
              opacity: 0.8,
              fontSize: { xs: '1rem', md: '1.1rem' }
            }}
          >
            Stay informed about the rapidly evolving world of artificial intelligence. 
            We bring you curated news, insights, and analysis from the forefront of AI technology.
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Hero;