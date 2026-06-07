import React from 'react';
import { Container, Typography, Box, TextField, Button, Paper } from '@mui/material';
import Layout from '../../components/layout/Layout';
import emailjs from "@emailjs/browser";
import { getText } from '../../utils/i18n';

export default function Contact({ darkMode, toggleDarkMode, locale, toggleLocale }) {
  const text = getText(locale);

  const handleSubmit = (event) => {
    event.preventDefault();

    const templateParams = {
      from_name: event.target.name.value,
      user_email: event.target.email.value,
      message: event.target.message.value,
    };

    emailjs
      .send(
        "service_w7ohii5",
        "template_p93tp4f",
        templateParams,
        "yRrTnmnow7ooMfiv_"
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          alert(text.contact.success);
        },
        (err) => {
          console.error("FAILED...", err);
          alert(text.contact.failure);
        }
      );
  };

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} locale={locale} toggleLocale={toggleLocale}>
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        {text.contact.title}
        </Typography>
        <Paper sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label={text.contact.name}
              name="name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={text.contact.email}
              name="email"
              autoComplete="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="message"
              label={text.contact.message}
              id="message"
              multiline
              rows={4}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {text.contact.submit}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
}
