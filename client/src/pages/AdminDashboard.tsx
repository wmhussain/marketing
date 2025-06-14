import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Box,
  Button,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [trainings, setTrainings] = useState([]);
  const [events, setEvents] = useState([]);
  const [contacts, setContacts] = useState([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchData = async () => {
      try {
        const [trainingsRes, eventsRes, contactsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/trainings'),
          axios.get('http://localhost:5001/api/events'),
          axios.get('http://localhost:5001/api/contact'),
        ]);

        setTrainings(trainingsRes.data);
        setEvents(eventsRes.data);
        setContacts(contactsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddNew = (type: 'training' | 'event') => {
    if (type === 'training') {
      navigate('/admin/trainings/add');
    } else {
      navigate('/admin/events/add');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Cloudvillage Trainings Admin Dashboard
      </Typography>
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Trainings" />
          <Tab label="Events" />
          <Tab label="Contact Messages" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddNew('training')}
            >
              Add New Training
            </Button>
          </Box>
          {/* Training list */}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddNew('event')}
            >
              Add New Event
            </Button>
          </Box>
          {/* Event list */}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Contact messages list */}
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AdminDashboard; 