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

export default function About({ darkMode, toggleDarkMode }) {
  const featureItems = [
    {
      icon: <CodeIcon color="primary" />,
      primary: "Cutting-Edge Insights",
      secondary: "Deep dive into the most advanced AI technologies and innovations.",
    },
    {
      icon: <AutoGraphIcon color="secondary" />,
      primary: "Comprehensive Analysis",
      secondary: "Bridging complex technical concepts with clear, accessible reporting.",
    },
    {
      icon: <ArticleIcon color="success" />,
      primary: "Curated Content",
      secondary: "Carefully selected news and research from the most reliable sources.",
    },
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
            Discover AI-INFOCUS
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
            AI-INFOCUS is your go-to platform for staying updated on the latest breakthroughs
            in the AI world. Its mission is to bridge the gap between complex
            AI advancements and clear, comprehensive reporting.
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
            Created with passion and dedication, AI-INFOCUS is an initiative
            striving to make the world of AI accessible and engaging for everyone.
          </Typography>
        </Paper>
      </Container>
    </Layout>
  );
}
