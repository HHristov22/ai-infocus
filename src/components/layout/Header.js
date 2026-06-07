import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import { 
  LightMode, 
  DarkMode, 
  Menu as MenuIcon,
  Newspaper,
  ContactMail,
  Info,
  Star
} from '@mui/icons-material';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { title: 'News', path: '/news', icon: <Newspaper /> },
  { title: 'Contact', path: '/contact', icon: <ContactMail /> },
  { title: 'Features', path: '/features', icon: <Star/> },
  { title: 'About', path: '/about', icon: <Info /> }
];

const menuIconVariants = {
  closed: {
    rotate: 0,
  },
  open: {
    rotate: 90,
  }
};

export default function Header({ darkMode, toggleDarkMode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const DrawerList = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer}
    >
      <List>
        {navItems.map((item) => (
          <Link href={item.path} key={item.path} passHref>
            <ListItem 
              button 
              component="a"
              sx={{
                '&:hover': {
                  backgroundColor: (theme) => 
                    theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: (theme) => theme.palette.primary.main 
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.title} 
                primaryTypographyProps={{
                  sx: { 
                    fontFamily: 'Righteous',
                    fontSize: '1.1rem'
                  }
                }}
              />
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#106EBE' }}>
      <Toolbar sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <motion.div
            animate={drawerOpen ? "open" : "closed"}
            variants={menuIconVariants}
            transition={{ duration: 0.3 }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </motion.div>

          <Link href="/" passHref>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Righteous',
                fontSize: { xs: '28px', md: '42px' },
                color: 'white',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              AI-INFOCUS
            </Typography>
          </Link>
        </Box>

        <IconButton 
          color="inherit" 
          onClick={toggleDarkMode}
          sx={{ ml: 2 }}
        >
          {darkMode ? <LightMode /> : <DarkMode />}
        </IconButton>

        <AnimatePresence>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer}
            sx={{
              '& .MuiDrawer-paper': {
                backgroundColor: (theme) => 
                  theme.palette.mode === 'dark' 
                    ? theme.palette.background.default
                    : '#fff'
              }
            }}
          >
            <DrawerList />
          </Drawer>
        </AnimatePresence>
      </Toolbar>
    </AppBar>
  );
}