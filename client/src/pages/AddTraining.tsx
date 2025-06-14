import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface TrainingFormData {
  title: string;
  description: string;
  content: string;
  courseUrl: string;
  price: number;
  imageUrl: string;
}

const AddTraining = () => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrainingFormData>();

  const onSubmit = async (data: TrainingFormData) => {
    try {
      await axios.post('http://localhost:5001/api/trainings', data);
      setSnackbar({
        open: true,
        message: 'Training course added successfully!',
        severity: 'success',
      });
      setTimeout(() => {
        navigate('/trainings');
      }, 2000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to add training course. Please try again.',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Add New Training - Cloudvillage Trainings
      </Typography>
      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <TextField
            fullWidth
            label="Content"
            multiline
            rows={6}
            margin="normal"
            {...register('content', { required: 'Content is required' })}
            error={!!errors.content}
            helperText={errors.content?.message}
          />
          <TextField
            fullWidth
            label="Course URL"
            margin="normal"
            {...register('courseUrl', {
              required: 'Course URL is required',
              pattern: {
                value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                message: 'Please enter a valid URL',
              },
            })}
            error={!!errors.courseUrl}
            helperText={errors.courseUrl?.message}
          />
          <TextField
            fullWidth
            label="Price"
            type="number"
            margin="normal"
            {...register('price', {
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' },
            })}
            error={!!errors.price}
            helperText={errors.price?.message}
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
              Add Training Course
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              fullWidth
              onClick={() => navigate('/trainings')}
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

export default AddTraining; 