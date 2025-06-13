import React, { useState, useEffect, useRef } from 'react';
import { 
  Button, 
  Box, 
  TextField, 
  CircularProgress,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import UploadIcon from '@mui/icons-material/CloudUpload';
import PageContainer from '../components/PageContainer';
import JsonDisplay from '../components/JsonDisplay';
import apiService from '../api/apiService';

// Fallback mock projects if the API fails
const MOCK_PROJECTS = [
  { id: 1, name: 'Demo Project 1' },
  { id: 2, name: 'Demo Project 2' }
];

const UploadDataPage = ({ mockMode }) => {
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState([]);
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const fileInputRef = useRef();

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      
      try {
        if (mockMode) {
          // Use mock data in mock mode
          setTimeout(() => {
            setProjects(MOCK_PROJECTS);
            setLoadingProjects(false);
          }, 800);
        } else {
          try {
            // Fetch real projects from backend
            const response = await apiService.getProjects();
            if (response.data && Array.isArray(response.data.projects)) {
              setProjects(response.data.projects);
            } else {
              console.warn('Projects API returned invalid data format, using mock data');
              setProjects(MOCK_PROJECTS);
            }
          } catch (err) {
            console.error('Error fetching projects:', err);
            // Fallback to mock projects if the API fails
            setProjects(MOCK_PROJECTS);
          }
          setLoadingProjects(false);
        }
      } catch (err) {
        console.error('Error in project loading:', err);
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [mockMode]);

  const handleProjectChange = (event) => {
    setProjectId(event.target.value);
    setResponse(null);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log('File selected:', selectedFile);
    
    if (selectedFile) {
      // Check if it's a PDF
      if (selectedFile.type !== 'application/pdf') {
        setResponse({
          error: 'Only PDF files are supported'
        });
        return;
      }
      
      setFile(selectedFile);
      setResponse(null);
    }
  };

  const handleUpload = async () => {
    if (!projectId || !file) return;
    
    setLoading(true);
    setResponse(null);
    
    try {
      console.log(`Uploading file to project ${projectId}:`, file);
      console.log('File type:', file.type);
      
      const result = await apiService.uploadFile(projectId, file);
      console.log('Upload response:', result);
      
      setResponse(result.data);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setResponse({ 
        error: `Upload failed: ${error.message}`,
        details: error.response?.data || 'No details available'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Upload Data"
      description="Upload a PDF file to a project for processing."
      endpoint="POST /api/v1/data/upload/{project_id}"
    >
      <Box sx={{ mt: 2 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="project-select-label">Project</InputLabel>
          <Select
            labelId="project-select-label"
            value={projectId}
            label="Project"
            onChange={handleProjectChange}
            disabled={loadingProjects || projects.length === 0}
          >
            {loadingProjects ? (
              <MenuItem disabled>Loading projects...</MenuItem>
            ) : projects.length === 0 ? (
              <MenuItem disabled>No projects available</MenuItem>
            ) : (
              projects.map((project) => (
                <MenuItem key={project.id} value={project.id.toString()}>
                  {project.name || `Project ${project.id}`}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        
        <Paper 
          elevation={0} 
          variant="outlined"
          sx={{ 
            p: 3, 
            mt: 2,
            border: '1px dashed',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            ref={fileInputRef}
            accept=".pdf"
          />
          <Button 
            variant="outlined"
            onClick={() => fileInputRef.current.click()}
            startIcon={<UploadIcon />}
            sx={{ mb: 2 }}
          >
            Select File
          </Button>
          <Typography variant="body2" color="text.secondary">
            {file ? `Selected: ${file.name}` : 'PDF files only (.pdf)'}
          </Typography>
        </Paper>

        <Button 
          variant="contained" 
          onClick={handleUpload}
          disabled={loading || !projectId || !file}
          startIcon={loading ? <CircularProgress size={24} /> : <UploadIcon />}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? 'Uploading...' : 'Upload File'}
        </Button>
      </Box>

      {response && (
        <JsonDisplay data={response} title="Response" />
      )}
    </PageContainer>
  );
};

export default UploadDataPage; 