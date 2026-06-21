import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Paper } from '@mui/material';
import Layout from '../../components/layout/Layout';
import { getText } from '../../utils/i18n';

export default function Contact({ darkMode, toggleDarkMode, locale, toggleLocale }) {
  const text = getText(locale);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const fromName = String(formData.get('name') || '').trim();
    const userEmail = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!fromName || !userEmail || !message) {
      alert(text.contact.failure);
      return;
    }

    const templateParams = {
      from_name: fromName,
      user_email: userEmail,
      message,
    };

    try {
      setIsSending(true);
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateParams),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        const details = errorPayload?.error || `HTTP ${response.status}`;
        throw new Error(details);
      }

      alert(text.contact.success);
      event.currentTarget.reset();
    } catch (err) {
      console.error('FAILED...', err);
      const details = err?.text || err?.message || '';
      alert(details ? `${text.contact.failure} (${details})` : text.contact.failure);
    } finally {
      setIsSending(false);
    }
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
              disabled={isSending}
              sx={{ mt: 3, mb: 2 }}
            >
              {isSending ? text.contact.sending : text.contact.submit}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
}
