import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Box, 
  TextField, 
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import PageContainer from '../components/PageContainer';
import JsonDisplay from '../components/JsonDisplay';
import apiService from '../api/apiService';

// Fallback mock projects if the API fails
const MOCK_PROJECTS = [
  { id: 1, name: 'Demo Project 1' },
  { id: 2, name: 'Demo Project 2' }
];

const ProcessDataPage = ({ mockMode }) => {
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState([]);
  const [fileId, setFileId] = useState('');
  const [chunkSize, setChunkSize] = useState(1000);
  const [overlapSize, setOverlapSize] = useState(200);
  const [doReset, setDoReset] = useState(false);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

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

  const handleProcessData = async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const options = {
        file_id: fileId || undefined,
        chunk_size: chunkSize,
        overlap_size: overlapSize,
        do_reset: doReset ? 1 : 0
      };
      
      const result = await apiService.processData(projectId, options);
      setResponse(result.data);
    } catch (error) {
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Process Data"
      description="Processes uploaded files into text chunks for a project."
      endpoint="POST /api/v1/data/process/{project_id}"
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
        
        <TextField
          label="File ID (Optional)"
          value={fileId}
          onChange={(e) => setFileId(e.target.value)}
          fullWidth
          margin="normal"
          helperText="Leave empty to process all files"
        />
        
        <TextField
          label="Chunk Size"
          type="number"
          value={chunkSize}
          onChange={(e) => setChunkSize(Number(e.target.value))}
          fullWidth
          margin="normal"
          required
        />
        
        <TextField
          label="Overlap Size"
          type="number"
          value={overlapSize}
          onChange={(e) => setOverlapSize(Number(e.target.value))}
          fullWidth
          margin="normal"
          required
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={doReset}
              onChange={(e) => setDoReset(e.target.checked)}
            />
          }
          label="Reset (Delete existing chunks)"
          sx={{ mt: 2, mb: 1 }}
        />

        <Button 
          variant="contained" 
          onClick={handleProcessData}
          disabled={loading || !projectId}
          startIcon={loading ? <CircularProgress size={24} /> : null}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? 'Processing...' : 'Process Data'}
        </Button>
      </Box>

      {response && (
        <JsonDisplay data={response} title="Response" />
      )}
    </PageContainer>
  );
};

export default ProcessDataPage; 