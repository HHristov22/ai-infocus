import React from 'react';
import { Container, Typography, Box, TextField, Button, Paper } from '@mui/material';
import Layout from '../../components/layout/Layout';
import emailjs from "@emailjs/browser";

export default function Contact({ darkMode, toggleDarkMode }) {
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
          alert("Message sent successfully!");
        },
        (err) => {
          console.error("FAILED...", err);
          alert("Message failed to send.");
        }
      );
  };

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Contact Me
        </Typography>
        <Paper sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="message"
              label="Message"
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
              Send Message
            </Button>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
}
