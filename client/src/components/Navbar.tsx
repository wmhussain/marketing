import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [adminMenuAnchor, setAdminMenuAnchor] = useState<null | HTMLElement>(null);

  const handleAdminMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAdminMenuAnchor(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminMenuAnchor(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          Cloudvillage Trainings
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/trainings"
          >
            Trainings
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/events"
          >
            Events
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/trainers"
          >
            Trainers
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/about"
          >
            About
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/contact"
          >
            Contact
          </Button>
          {isAuthenticated ? (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/admin/dashboard"
              >
                Dashboard
              </Button>
              <Button
                color="inherit"
                onClick={handleAdminMenuOpen}
              >
                Admin
              </Button>
              <Menu
                anchorEl={adminMenuAnchor}
                open={Boolean(adminMenuAnchor)}
                onClose={handleAdminMenuClose}
              >
                <MenuItem
                  component={RouterLink}
                  to="/admin/trainings/add"
                  onClick={handleAdminMenuClose}
                >
                  Add Training
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/admin/events/add"
                  onClick={handleAdminMenuClose}
                >
                  Add Event
                </MenuItem>
              </Menu>
              <Button
                color="inherit"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : null}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 