import React from 'react';
import { Box, Container, Typography} from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          © {new Date().getFullYear()} AI-INFOCUS. All rights reserved.
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary">
          Stay informed about the latest news in AI world
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary">
          Made with 💪 and ❤️ in Europe’s 🌍 core.
        </Typography>
      </Container>
    </Box>
  );
}