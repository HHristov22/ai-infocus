import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Container } from '@mui/material';
import { getText } from '../../utils/i18n';

const Hero = ({ locale }) => {
  const text = getText(locale);

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
              fontFamily: 'Bitter',
              fontSize: { xs: '2rem', md: '3.75rem' }
            }}
          >
            {text.hero.title}
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
            {text.hero.subtitle}
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
            {text.hero.description}
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Hero;