import React, { useState } from 'react';
import { 
  Button, 
  Box, 
  TextField, 
  CircularProgress, 
  Typography,
  Paper
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PageContainer from '../components/PageContainer';
import JsonDisplay from '../components/JsonDisplay';
import apiService from '../api/apiService';

const UploadDataPage = () => {
  const [projectId, setProjectId] = useState('');
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!projectId || !file) return;
    
    setLoading(true);
    try {
      const result = await apiService.uploadFile(projectId, file);
      setResponse(result.data);
    } catch (error) {
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Upload Data"
      description="Upload a file to a specific project."
      endpoint="POST /api/v1/data/upload/{project_id}"
    >
      <Box sx={{ mt: 2 }}>
        <TextField
          label="Project ID"
          type="number"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 3, 
            mt: 2, 
            mb: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            border: '2px dashed #ccc',
            cursor: 'pointer'
          }}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="body1" gutterBottom>
            {file ? file.name : 'Click to select a PDF file'}
          </Typography>
          {file && (
            <Typography variant="body2" color="text.secondary">
              {(file.size / 1024).toFixed(2)} KB
            </Typography>
          )}
        </Paper>

        <Button 
          variant="contained" 
          onClick={handleUpload}
          disabled={loading || !projectId || !file}
          startIcon={loading ? <CircularProgress size={24} /> : null}
          fullWidth
        >
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
      </Box>

      {response && (
        <JsonDisplay data={response} title="Response" />
      )}
    </PageContainer>
  );
};

export default UploadDataPage; 