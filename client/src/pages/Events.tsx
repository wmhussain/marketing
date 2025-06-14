import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, isWithinInterval, eachDayOfInterval } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timeZone: string;
  location: string;
  trainingId: string;
  imageUrl: string;
}

interface Training {
  id: string;
  title: string;
}

const timeZones = [
  'UTC',
  'Asia/Kolkata',
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Karachi',
  'Asia/Bangkok',
  'Asia/Manila',
  'Asia/Jakarta',
  'Asia/Seoul',
  'Asia/Hong_Kong',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'America/Toronto',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Pacific/Auckland',
];

const Events = () => {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [trainings, setTrainings] = useState<{ [key: string]: Training }>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, trainingsRes] = await Promise.all([
        axios.get('http://localhost:5001/api/events'),
        axios.get('http://localhost:5001/api/trainings'),
      ]);
      setEvents(eventsRes.data);
      
      const trainingMap = trainingsRes.data.reduce((acc: { [key: string]: Training }, training: Training) => {
        acc[training.id] = training;
        return acc;
      }, {});
      setTrainings(trainingMap);
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Error fetching data', 'error');
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`http://localhost:5001/api/events/${id}`);
        setEvents(events.filter(event => event.id !== id));
        showSnackbar('Event deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting event:', error);
        showSnackbar('Error deleting event', 'error');
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const handleSave = async () => {
    if (!selectedEvent) return;

    try {
      await axios.put(`http://localhost:5001/api/events/${selectedEvent.id}`, selectedEvent);
      setEvents(events.map(event => 
        event.id === selectedEvent.id ? selectedEvent : event
      ));
      showSnackbar('Event updated successfully', 'success');
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating event:', error);
      showSnackbar('Error updating event', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventStartDate = new Date(event.startDate);
      const eventEndDate = new Date(event.endDate);
      return isWithinInterval(date, { start: eventStartDate, end: eventEndDate });
    });
  };

  const formatTimeRange = (event: Event) => {
    return `${event.startTime} - ${event.endTime}`;
  };

  const getEventDays = (event: Event) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    const days = eachDayOfInterval({ start, end });
    return days.map(day => format(day, 'MMM d, yyyy'));
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const eventsOnDate = getEventsForDate(date);
    return eventsOnDate.length > 0 ? 'has-event' : null;
  };

  const selectedEvents = getEventsForDate(selectedDate);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Upcoming Events
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Calendar
              onChange={(value: any) => {
                if (value instanceof Date) {
                  setSelectedDate(value);
                }
              }}
              value={selectedDate}
              className="react-calendar"
              tileClassName={tileClassName}
            />
            <style>
              {`
                .react-calendar__tile.has-event {
                  position: relative;
                }
                .react-calendar__tile.has-event::after {
                  content: '';
                  position: absolute;
                  bottom: 4px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 6px;
                  height: 6px;
                  background-color: #f44336;
                  border-radius: 50%;
                }
              `}
            </style>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Events on {selectedDate.toLocaleDateString()}
            </Typography>
            {selectedEvents.length > 0 ? (
              <List>
                {selectedEvents.map((event) => (
                  <ListItem key={event.id} divider>
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            {format(new Date(event.startDate), 'MMM d, yyyy')} - {format(new Date(event.endDate), 'MMM d, yyyy')}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            Daily Schedule: {formatTimeRange(event)} ({event.timeZone})
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            {event.description}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            Location: {event.location}
                          </Typography>
                          {trainings[event.trainingId] && (
                            <Typography component="span" variant="body2" display="block">
                              Training: {trainings[event.trainingId].title}
                            </Typography>
                          )}
                        </>
                      }
                    />
                    <Box sx={{ ml: 2, display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        href={`/trainings#${event.trainingId}`}
                      >
                        View Training
                      </Button>
                      {isAuthenticated && (
                        <>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(event)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(event.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No events scheduled for this date.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Training</InputLabel>
                <Select
                  value={selectedEvent.trainingId}
                  label="Training"
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, trainingId: e.target.value })}
                >
                  {Object.values(trainings).map((training) => (
                    <MenuItem key={training.id} value={training.id}>
                      {training.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Title"
                value={selectedEvent.title}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={selectedEvent.description}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={new Date(selectedEvent.startDate)}
                  onChange={(date) => {
                    if (date) {
                      setSelectedEvent({ ...selectedEvent, startDate: format(date, 'yyyy-MM-dd') });
                    }
                  }}
                />
                <DatePicker
                  label="End Date"
                  value={new Date(selectedEvent.endDate)}
                  onChange={(date) => {
                    if (date) {
                      setSelectedEvent({ ...selectedEvent, endDate: format(date, 'yyyy-MM-dd') });
                    }
                  }}
                />
              </LocalizationProvider>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={selectedEvent.startTime}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, startTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="End Time"
                type="time"
                value={selectedEvent.endTime}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, endTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth>
                <InputLabel>Time Zone</InputLabel>
                <Select
                  value={selectedEvent.timeZone}
                  label="Time Zone"
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, timeZone: e.target.value })}
                >
                  {timeZones.map((tz) => (
                    <MenuItem key={tz} value={tz}>
                      {tz}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Location"
                value={selectedEvent.location}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, location: e.target.value })}
              />
              <TextField
                fullWidth
                label="Image URL"
                value={selectedEvent.imageUrl}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, imageUrl: e.target.value })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Events; 