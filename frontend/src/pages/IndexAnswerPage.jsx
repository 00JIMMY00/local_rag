import React, { useState, useEffect } from 'react';
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
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PageContainer from '../components/PageContainer';
import JsonDisplay from '../components/JsonDisplay';
import apiService from '../api/apiService';

// Fallback mock projects if the API fails
const MOCK_PROJECTS = [
  { id: 1, name: 'Demo Project 1' },
  { id: 2, name: 'Demo Project 2' }
];

const IndexAnswerPage = ({ mockMode }) => {
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState([]);
  const [question, setQuestion] = useState('');
  const [limit, setLimit] = useState(5);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

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

  const handleGetAnswer = async () => {
    if (!projectId || !question) return;
    
    setLoading(true);
    try {
      const result = await apiService.getAnswer(projectId, question, limit);
      setResponse(result.data);
    } catch (error) {
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="RAG Answer"
      description="Generates an answer to a question using the RAG (Retrieval-Augmented Generation) approach."
      endpoint="POST /api/v1/nlp/index/answer/{project_id}"
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
          label="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          fullWidth
          margin="normal"
          required
          multiline
          rows={2}
        />
        
        <TextField
          label="Limit"
          type="number"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          fullWidth
          margin="normal"
          helperText="Maximum number of documents to retrieve"
        />

        <Button 
          variant="contained" 
          onClick={handleGetAnswer}
          disabled={loading || !projectId || !question}
          startIcon={loading ? <CircularProgress size={24} /> : <QuestionAnswerIcon />}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? 'Generating Answer...' : 'Get Answer'}
        </Button>
      </Box>

      {response && response.answer && !response.error && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Answer</Typography>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => setShowRaw(!showRaw)}
            >
              {showRaw ? 'Show Formatted' : 'Show Raw JSON'}
            </Button>
          </Box>
          
          {showRaw ? (
            <JsonDisplay data={response} />
          ) : (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {response.answer}
              </Typography>
            </Paper>
          )}
        </Box>
      )}

      {response && response.error && (
        <JsonDisplay data={response} title="Error" />
      )}
    </PageContainer>
  );
};

export default IndexAnswerPage; 