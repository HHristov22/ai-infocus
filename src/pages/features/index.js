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

export default function FutureEnhancements({ darkMode, toggleDarkMode }) {
  const enhancementItems = [
    {
      icon: <RocketLaunchIcon color="primary" />,
      primary: "Expand News Sources for Broader Coverage",
      secondary: "Incorporate additional reliable sources to provide a more comprehensive view of the AI landscape.",
    },
    {
      icon: <RecommendIcon color="secondary" />,
      primary: "Introduce User Preferences and Tailored Recommendations",
      secondary: "Enable users to customize their news feed based on topics of interest, creating a more personalized experience.",
    },
    {
      icon: <AutoGraphIcon color="success" />,
      primary: "Improve News Visualization",
      secondary: "Enhance the presentation of news articles with better image integration, external links, and an intuitive layout.",
    }
  ];

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
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
            Future Enhancements
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
            AI-INFOCUS is committed to continuous improvement, and several exciting enhancements are planned for the future. The roadmap focuses on creating a more dynamic, personalized, and comprehensive AI news experience.
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