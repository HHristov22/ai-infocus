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
import { getText } from '../../utils/i18n';

const navItems = (text) => [
  { title: text.nav.news, path: '/news', icon: <Newspaper /> },
  { title: text.nav.contact, path: '/contact', icon: <ContactMail /> },
  { title: text.nav.features, path: '/features', icon: <Star/> },
  { title: text.nav.about, path: '/about', icon: <Info /> }
];

const menuIconVariants = {
  closed: {
    rotate: 0,
  },
  open: {
    rotate: 90,
  }
};

export default function Header({ darkMode, toggleDarkMode, locale, toggleLocale }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const text = getText(locale);
  const languageSwitch = locale === 'bg'
    ? { shortLabel: 'БГ', ariaLabel: 'Превключи на английски' }
    : { shortLabel: 'EN', ariaLabel: 'Switch to Bulgarian' };
  const headerIconButtonSx = {
    width: 44,
    height: 44,
    borderRadius: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255, 255, 255, 0.22)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    transition: 'background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.16)',
      borderColor: 'rgba(255, 255, 255, 0.4)',
      transform: 'translateY(-1px)',
    }
  };

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
        {navItems(text).map((item) => (
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
                    fontFamily: 'Bitter',
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
                fontFamily: 'Bitter',
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <IconButton
            onClick={toggleLocale}
            color="inherit"
            aria-label={languageSwitch.ariaLabel}
            sx={{
              ...headerIconButtonSx,
              fontFamily: 'Bitter',
              fontSize: '0.95rem',
              fontWeight: 700,
            }}
          >
            {languageSwitch.shortLabel}
          </IconButton>

          <IconButton 
            color="inherit"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            sx={{
              ...headerIconButtonSx,
              '& .MuiSvgIcon-root': {
                fontSize: 22,
              }
            }}
          >
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Box>

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