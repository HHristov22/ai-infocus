import React from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Code as CodeIcon,
  AutoGraph as AutoGraphIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { getText } from '../../utils/i18n';

export default function About({ darkMode, toggleDarkMode, locale, toggleLocale }) {
  const text = getText(locale);
  const featureItems = [
    {
      icon: <CodeIcon color="primary" />,
      ...text.about.items[0],
    },
    {
      icon: <AutoGraphIcon color="secondary" />,
      ...text.about.items[1],
    },
    {
      icon: <ArticleIcon color="success" />,
      ...text.about.items[2],
    },
  ];

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} locale={locale} toggleLocale={toggleLocale}>
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: (theme) =>
              darkMode
                ? theme.palette.background.default
                : theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              mb: 4,
              textAlign: 'center',
              fontWeight: 'bold',
              color: (theme) => theme.palette.text.primary,
            }}
          >
            {text.about.title}
          </Typography>

          <Typography
            paragraph
            sx={{
              mb: 3,
              typography: 'body1',
              lineHeight: 1.8,
              textAlign: 'justify',
            }}
          >
            {text.about.intro}
          </Typography>

          <List
            sx={{
              width: '100%',
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            {featureItems.map((item, index) => (
              <React.Fragment key={item.primary}>
                <ListItem>
                  <ListItemIcon>
                    <Avatar
                      sx={{
                        bgcolor: 'transparent',
                        color: item.icon.props.color,
                        width: 48,
                        height: 48,
                      }}
                    >
                      {item.icon}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                        {item.primary}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {item.secondary}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < featureItems.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>

          <Typography
            paragraph
            sx={{
              mt: 3,
              typography: 'body1',
              lineHeight: 1.8,
              textAlign: 'justify',
            }}
          >
            {text.about.outro}
          </Typography>
        </Paper>
      </Container>
    </Layout>
  );
}
