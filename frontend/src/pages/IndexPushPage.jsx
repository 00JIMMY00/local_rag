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

const IndexPushPage = ({ mockMode }) => {
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState([]);
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

  const handlePushToIndex = async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const result = await apiService.pushToIndex(projectId, { do_reset: doReset ? 1 : 0 });
      setResponse(result.data);
    } catch (error) {
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Index Push"
      description="Pushes processed data to the vector database for a project."
      endpoint="POST /api/v1/nlp/index/push/{project_id}"
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

        <FormControlLabel
          control={
            <Switch
              checked={doReset}
              onChange={(e) => setDoReset(e.target.checked)}
            />
          }
          label="Reset Index (Delete existing data)"
          sx={{ mt: 2, mb: 1 }}
        />

        <Button 
          variant="contained" 
          onClick={handlePushToIndex}
          disabled={loading || !projectId}
          startIcon={loading ? <CircularProgress size={24} /> : null}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? 'Pushing to Index...' : 'Push to Index'}
        </Button>
      </Box>

      {response && (
        <JsonDisplay data={response} title="Response" />
      )}
    </PageContainer>
  );
};

export default IndexPushPage; 