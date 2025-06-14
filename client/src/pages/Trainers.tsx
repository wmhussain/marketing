import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  IconButton,
  Fab,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Trainer {
  id: string;
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  linkedinUrl: string;
  expertise: string[];
}

const Trainers = () => {
  const { isAuthenticated } = useAuth();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/trainers');
      setTrainers(response.data);
    } catch (error) {
      console.error('Error fetching trainers:', error);
      showSnackbar('Error fetching trainers', 'error');
    }
  };

  const handleAdd = () => {
    setSelectedTrainer({
      id: '',
      name: '',
      title: '',
      bio: '',
      imageUrl: '',
      linkedinUrl: '',
      expertise: [],
    });
    setOpenDialog(true);
  };

  const handleEdit = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        await axios.delete(`http://localhost:5001/api/trainers/${id}`);
        setTrainers(trainers.filter(trainer => trainer.id !== id));
        showSnackbar('Trainer deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting trainer:', error);
        showSnackbar('Error deleting trainer', 'error');
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTrainer(null);
  };

  const handleSave = async () => {
    if (!selectedTrainer) return;

    try {
      if (selectedTrainer.id) {
        // Update existing trainer
        await axios.put(`http://localhost:5001/api/trainers/${selectedTrainer.id}`, selectedTrainer);
        setTrainers(trainers.map(trainer => 
          trainer.id === selectedTrainer.id ? selectedTrainer : trainer
        ));
      } else {
        // Add new trainer
        const response = await axios.post('http://localhost:5001/api/trainers', selectedTrainer);
        setTrainers([...trainers, response.data]);
      }
      showSnackbar(`Trainer ${selectedTrainer.id ? 'updated' : 'added'} successfully`, 'success');
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving trainer:', error);
      showSnackbar('Error saving trainer', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Our Trainers
      </Typography>

      <Grid container spacing={4}>
        {trainers.map((trainer) => (
          <Grid item key={trainer.id} xs={12} md={6} lg={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="300"
                image={trainer.imageUrl}
                alt={trainer.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {trainer.name}
                </Typography>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {trainer.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {trainer.bio}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Expertise:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {trainer.expertise.map((skill, index) => (
                      <Typography
                        key={index}
                        variant="body2"
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        {skill}
                      </Typography>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    startIcon={<LinkedInIcon />}
                    href={trainer.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn Profile
                  </Button>
                  {isAuthenticated && (
                    <Box>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(trainer)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(trainer.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {isAuthenticated && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={handleAdd}
        >
          <AddIcon />
        </Fab>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedTrainer?.id ? 'Edit Trainer' : 'Add New Trainer'}
        </DialogTitle>
        <DialogContent>
          {selectedTrainer && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Name"
                value={selectedTrainer.name}
                onChange={(e) => setSelectedTrainer({ ...selectedTrainer, name: e.target.value })}
              />
              <TextField
                fullWidth
                label="Title"
                value={selectedTrainer.title}
                onChange={(e) => setSelectedTrainer({ ...selectedTrainer, title: e.target.value })}
              />
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={4}
                value={selectedTrainer.bio}
                onChange={(e) => setSelectedTrainer({ ...selectedTrainer, bio: e.target.value })}
              />
              <TextField
                fullWidth
                label="Image URL"
                value={selectedTrainer.imageUrl}
                onChange={(e) => setSelectedTrainer({ ...selectedTrainer, imageUrl: e.target.value })}
              />
              <TextField
                fullWidth
                label="LinkedIn URL"
                value={selectedTrainer.linkedinUrl}
                onChange={(e) => setSelectedTrainer({ ...selectedTrainer, linkedinUrl: e.target.value })}
              />
              <TextField
                fullWidth
                label="Expertise (comma-separated)"
                value={selectedTrainer.expertise.join(', ')}
                onChange={(e) => setSelectedTrainer({
                  ...selectedTrainer,
                  expertise: e.target.value.split(',').map(skill => skill.trim()).filter(Boolean)
                })}
                helperText="Enter skills separated by commas"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {selectedTrainer?.id ? 'Save Changes' : 'Add Trainer'}
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

export default Trainers; 