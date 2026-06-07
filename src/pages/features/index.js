import React from 'react';
import { 
  Container, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Paper,
  Divider
} from '@mui/material';
import { 
  RocketLaunch as RocketLaunchIcon, 
  AutoGraph as AutoGraphIcon, 
  Recommend as RecommendIcon 
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { getText } from '../../utils/i18n';

export default function FutureEnhancements({ darkMode, toggleDarkMode, locale, toggleLocale }) {
  const text = getText(locale);
  const enhancementItems = [
    {
      icon: <RocketLaunchIcon color="primary" />,
      ...text.features.items[0],
    },
    {
      icon: <RecommendIcon color="secondary" />,
      ...text.features.items[1],
    },
    {
      icon: <AutoGraphIcon color="success" />,
      ...text.features.items[2],
    }
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
                : theme.palette.background.paper
          }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              mb: 4, 
              textAlign: 'center',
              fontWeight: 'bold',
              color: (theme) => theme.palette.text.primary
            }}
          >
            {text.features.title}
          </Typography>

          <Typography 
            paragraph 
            sx={{ 
              mb: 3,
              typography: 'body1', 
              lineHeight: 1.8, 
              textAlign: 'justify' 
            }}
          >
            {text.features.intro}
          </Typography>

          <List 
            sx={{ 
              width: '100%', 
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`
            }}
          >
            {enhancementItems.map((item, index) => (
              <React.Fragment key={item.primary}>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    {item.icon}
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
                {index < enhancementItems.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>

          <Typography 
            paragraph 
            sx={{ 
              mt: 3,
              typography: 'body1', 
              lineHeight: 1.8, 
              textAlign: 'justify' 
            }}
          >
            {/* Our commitment to innovation drives these planned enhancements, ensuring AI-INFOCUS remains at the forefront 
            of delivering insightful and engaging AI news content. */}
          </Typography>
        </Paper>
      </Container>
    </Layout>
  );
}