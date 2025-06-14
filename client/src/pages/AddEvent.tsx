import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

interface Training {
  id: string;
  title: string;
}

interface EventFormData {
  title: string;
  description: string;
  date: Date;
  time: string;
  timeZone: string;
  location: string;
  trainingId: string;
  imageUrl: string;
}

const timeZones = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Dubai',
  'Asia/Singapore',
  'Australia/Sydney',
];

const AddEvent = () => {
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>();

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/trainings');
        setTrainings(response.data);
      } catch (error) {
        console.error('Error fetching trainings:', error);
      }
    };
    fetchTrainings();
  }, []);

  const onSubmit = async (data: EventFormData) => {
    try {
      await axios.post('http://localhost:5001/api/events', {
        ...data,
        date: format(data.date, 'yyyy-MM-dd'),
      });
      setSnackbar({
        open: true,
        message: 'Event added successfully!',
        severity: 'success',
      });
      setTimeout(() => {
        navigate('/events');
      }, 2000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to add event. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleTrainingChange = (event: SelectChangeEvent) => {
    const trainingId = event.target.value;
    setValue('trainingId', trainingId);
    const selectedTraining = trainings.find((t) => t.id === trainingId);
    if (selectedTraining) {
      setValue('title', selectedTraining.title);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Add New Event
      </Typography>
      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Training</InputLabel>
            <Select
              label="Select Training"
              {...register('trainingId', { required: 'Training is required' })}
              error={!!errors.trainingId}
              onChange={handleTrainingChange}
            >
              {trainings.map((training) => (
                <MenuItem key={training.id} value={training.id}>
                  {training.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Title"
            margin="normal"
            {...register('title', { required: 'Title is required' })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            margin="normal"
            {...register('description', { required: 'Description is required' })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={watch('date')}
              onChange={(newValue) => {
                setValue('date', newValue || new Date());
              }}
              sx={{ width: '100%', mt: 2, mb: 1 }}
            />
          </LocalizationProvider>
          <TextField
            fullWidth
            label="Time"
            type="time"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...register('time', { required: 'Time is required' })}
            error={!!errors.time}
            helperText={errors.time?.message}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Time Zone</InputLabel>
            <Select
              label="Time Zone"
              {...register('timeZone', { required: 'Time zone is required' })}
              error={!!errors.timeZone}
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
            margin="normal"
            {...register('location', { required: 'Location is required' })}
            error={!!errors.location}
            helperText={errors.location?.message}
          />
          <TextField
            fullWidth
            label="Image URL"
            margin="normal"
            {...register('imageUrl', {
              required: 'Image URL is required',
              pattern: {
                value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                message: 'Please enter a valid URL',
              },
            })}
            error={!!errors.imageUrl}
            helperText={errors.imageUrl?.message}
          />
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Add Event
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              fullWidth
              onClick={() => navigate('/events')}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
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

export default AddEvent; 