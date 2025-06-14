import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface AboutContent {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  lastUpdated: string;
}

const About = () => {
  const { isAuthenticated } = useAuth();
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/about');
      setAboutContent(response.data);
    } catch (error) {
      console.error('Error fetching about content:', error);
      showSnackbar('Error fetching about content', 'error');
    }
  };

  const handleEdit = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    if (!aboutContent) return;

    try {
      await axios.put(`http://localhost:5001/api/about/${aboutContent.id}`, aboutContent);
      showSnackbar('About content updated successfully', 'success');
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating about content:', error);
      showSnackbar('Error updating about content', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  if (!aboutContent) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          About Us
        </Typography>
        <Typography variant="body1" align="center">
          Loading...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ position: 'relative' }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          About Us
        </Typography>
        {isAuthenticated && (
          <IconButton
            sx={{ position: 'absolute', right: 0, top: 0 }}
            color="primary"
            onClick={handleEdit}
          >
            <EditIcon />
          </IconButton>
        )}
      </Box>

      <Paper sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>
              {aboutContent.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{ whiteSpace: 'pre-line', mb: 2 }}
            >
              {aboutContent.content}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last updated: {new Date(aboutContent.lastUpdated).toLocaleDateString()}
            </Typography>
          </Box>
          {aboutContent.imageUrl && (
            <Box
              component="img"
              src={aboutContent.imageUrl}
              alt="About Us"
              sx={{
                width: { xs: '100%', md: '40%' },
                height: 'auto',
                objectFit: 'cover',
                borderRadius: 1,
              }}
            />
          )}
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Edit About Content</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={aboutContent.title}
              onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
            />
            <TextField
              fullWidth
              label="Content"
              multiline
              rows={10}
              value={aboutContent.content}
              onChange={(e) => setAboutContent({ ...aboutContent, content: e.target.value })}
            />
            <TextField
              fullWidth
              label="Image URL"
              value={aboutContent.imageUrl}
              onChange={(e) => setAboutContent({ ...aboutContent, imageUrl: e.target.value })}
            />
          </Box>
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

export default About; 