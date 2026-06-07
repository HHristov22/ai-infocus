import React from 'react';
import { Box, Container, Typography} from '@mui/material';
import { getText } from '../../utils/i18n';

export default function Footer({ locale }) {
  const text = getText(locale);

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
          © {new Date().getFullYear()} AI-INFOCUS. {text.footer.rights}
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary">
          {text.footer.tagline}
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary">
          {text.footer.madeWith}
        </Typography>
      </Container>
    </Box>
  );
}