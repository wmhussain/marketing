import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Link,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Training {
  id: string;
  title: string;
  description: string;
  content: string;
  courseUrl: string;
  price: number;
  imageUrl: string;
}

const Trainings = () => {
  const { isAuthenticated } = useAuth();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/trainings');
      setTrainings(response.data);
    } catch (error) {
      console.error('Error fetching trainings:', error);
      showSnackbar('Error fetching trainings', 'error');
    }
  };

  const handleEdit = (training: Training) => {
    setSelectedTraining(training);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this training?')) {
      try {
        await axios.delete(`http://localhost:5001/api/trainings/${id}`);
        setTrainings(trainings.filter(training => training.id !== id));
        showSnackbar('Training deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting training:', error);
        showSnackbar('Error deleting training', 'error');
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTraining(null);
  };

  const handleSave = async () => {
    if (!selectedTraining) return;

    try {
      await axios.put(`http://localhost:5001/api/trainings/${selectedTraining.id}`, selectedTraining);
      setTrainings(trainings.map(training => 
        training.id === selectedTraining.id ? selectedTraining : training
      ));
      showSnackbar('Training updated successfully', 'success');
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating training:', error);
      showSnackbar('Error updating training', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleInquire = (training: Training) => {
    const subject = `Inquiry about ${training.title}`;
    const body = `Hello,\n\nI am interested in the following training:\n\n${training.title}\n\n${training.description}\n\nPlease provide more information.\n\nBest regards,`;
    
    // Open email client
    window.location.href = `mailto:warsi.mazhar@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleWhatsApp = (training: Training) => {
    const message = `Hello, I am interested in the following training:\n\n${training.title}\n\n${training.description}\n\nPlease provide more information.`;
    window.open(`https://wa.me/919205191116?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Training Courses
      </Typography>
      <Grid container spacing={4}>
        {trainings.map((training) => (
          <Grid item key={training.id} xs={12} md={6} lg={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={training.imageUrl}
                alt={training.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {training.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {training.description}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  ${training.price}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    href={training.courseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Course
                  </Button>
                  <IconButton
                    color="primary"
                    onClick={() => handleInquire(training)}
                    title="Send Email"
                  >
                    <EmailIcon />
                  </IconButton>
                  <IconButton
                    color="success"
                    onClick={() => handleWhatsApp(training)}
                    title="Contact on WhatsApp"
                  >
                    <WhatsAppIcon />
                  </IconButton>
                  {isAuthenticated && (
                    <>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(training)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(training.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Training</DialogTitle>
        <DialogContent>
          {selectedTraining && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Title"
                value={selectedTraining.title}
                onChange={(e) => setSelectedTraining({ ...selectedTraining, title: e.target.value })}
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={selectedTraining.description}
                onChange={(e) => setSelectedTraining({ ...selectedTraining, description: e.target.value })}
              />
              <TextField
                fullWidth
                label="Content"
                multiline
                rows={4}
                value={selectedTraining.content}
                onChange={(e) => setSelectedTraining({ ...selectedTraining, content: e.target.value })}
              />
              <TextField
                fullWidth
                label="Course URL"
                value={selectedTraining.courseUrl}
                onChange={(e) => setSelectedTraining({ ...selectedTraining, courseUrl: e.target.value })}
              />
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={selectedTraining.price}
                onChange={(e) => setSelectedTraining({ ...selectedTraining, price: Number(e.target.value) })}
              />
              <TextField
                fullWidth
                label="Image URL"
                value={selectedTraining.imageUrl}
                onChange={(e) => setSelectedTraining({ ...selectedTraining, imageUrl: e.target.value })}
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

export default Trainings; 