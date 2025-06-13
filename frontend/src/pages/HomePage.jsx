import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Button,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import apiService from '../api/apiService';

// Fallback mock projects if the API fails
const MOCK_PROJECTS = [
  { id: 1, name: 'Demo Project 1' },
  { id: 2, name: 'Demo Project 2' }
];

// Mock chunks for when in mock mode
const MOCK_CHUNKS = [
  { id: 1, text: 'This is the first chunk of text from the document that matches your query.', score: 0.95, metadata: { source: 'document1.pdf', page: 1 } },
  { id: 2, text: 'This is the second chunk with information related to your question about the topic.', score: 0.85, metadata: { source: 'document1.pdf', page: 2 } },
  { id: 3, text: 'Third chunk containing relevant details about what you asked.', score: 0.80, metadata: { source: 'document2.pdf', page: 1 } },
  { id: 4, text: 'Fourth chunk with some more context about the subject matter.', score: 0.75, metadata: { source: 'document2.pdf', page: 3 } },
  { id: 5, text: 'Fifth chunk with additional supporting information.', score: 0.70, metadata: { source: 'document3.pdf', page: 1 } }
];

const HomePage = ({ mockMode }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState('error');
  const [useMockProjects, setUseMockProjects] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [creatingProject, setCreatingProject] = useState(false);
  const [topK, setTopK] = useState(5);
  const [chunks, setChunks] = useState([]);
  const [showChunks, setShowChunks] = useState(false);
  const fileInputRef = useRef();

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      setNotification(null);
      
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
              setUseMockProjects(true);
            }
          } catch (err) {
            console.error('Error fetching projects:', err);
            // Fallback to mock projects if the API fails
            setProjects(MOCK_PROJECTS);
            setUseMockProjects(true);
          }
          setLoadingProjects(false);
        }
      } catch (err) {
        console.error('Error in project loading:', err);
        showNotification('Failed to load projects. Please try again.', 'error');
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [mockMode]);

  const handleProjectSelect = (event) => {
    setSelectedProject(event.target.value);
    setChatHistory([]);
    setChunks([]);
    setShowChunks(false);
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    
    setCreatingProject(true);
    setNotification(null);
    
    try {
      if (mockMode || useMockProjects) {
        setTimeout(() => {
          const newProject = { id: projects.length + 1, name: newProjectName };
          setProjects([...projects, newProject]);
          setNewProjectName('');
          setCreatingProject(false);
        }, 800);
      } else {
        try {
          console.log('Creating project with name:', newProjectName);
          const response = await apiService.createProject(newProjectName);
          console.log('Project creation response:', response);
          
          if (response.data && response.data.project) {
            const newProject = response.data.project;
            console.log('New project created:', newProject);
            setProjects([...projects, newProject]);
            setNewProjectName('');
            // Automatically select the new project
            setSelectedProject(newProject.id.toString());
          } else {
            console.warn('Invalid project creation response format:', response);
            throw new Error('Invalid response format from server');
          }
        } catch (apiError) {
          console.error('API Error creating project:', apiError);
          const errorMessage = apiError.response?.data?.detail || 
                              apiError.response?.data?.signal || 
                              apiError.message || 
                              'Unknown error';
          showNotification(`Failed to create project: ${errorMessage}`, 'error');
        }
        setCreatingProject(false);
      }
    } catch (err) {
      console.error('Error creating project:', err);
      showNotification(`Failed to create project: ${err.message}`, 'error');
      setCreatingProject(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedProject || !chatInput.trim()) return;
    const userMessage = chatInput.trim();
    setChatInput('');
    setChatHistory((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    setChunks([]); // Clear previous chunks
    
    try {
      if (mockMode || useMockProjects) {
        setTimeout(() => {
          setChatHistory((prev) => [
            ...prev,
            { role: 'assistant', content: `This is a mock response to your question: "${userMessage}". In a real application, this would be generated by the RAG system.` }
          ]);
          // Set mock chunks
          setChunks(MOCK_CHUNKS.slice(0, topK));
          setShowChunks(true);
          setLoading(false);
        }, 1200);
      } else {
        // First fetch search results to get chunks
        const searchResult = await apiService.searchIndex(selectedProject, userMessage, topK);
        console.log('Search results:', searchResult);
        
        if (searchResult.data && Array.isArray(searchResult.data.results)) {
          setChunks(searchResult.data.results);
        }
        
        // Then get the answer based on these chunks
        const answerResult = await apiService.getAnswer(selectedProject, userMessage, topK);
        setChatHistory((prev) => [
          ...prev,
          { role: 'assistant', content: answerResult.data.answer }
        ]);
        setShowChunks(true);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error getting answer:', error);
      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, an error occurred while generating the answer.' }
      ]);
      setLoading(false);
    }
  };

  const handleTopKChange = (event, newValue) => {
    setTopK(newValue);
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    console.log('File selected:', selectedFile);
    
    if (!selectedFile) {
      console.log('No file selected');
      return;
    }
    
    if (!selectedProject) {
      console.log('No project selected');
      showNotification('Please select a project before uploading a file', 'error');
      return;
    }
    
    // Check if it's a PDF
    if (selectedFile.type !== 'application/pdf') {
      console.log('Invalid file type:', selectedFile.type);
      showNotification('Only PDF files are supported', 'error');
      return;
    }
    
    setUploading(true);
    setNotification(null);
    
    try {
      if (mockMode || useMockProjects) {
        console.log('Mock mode: simulating file upload');
        setTimeout(() => {
          setUploading(false);
          // Show success message
          showNotification(`File "${selectedFile.name}" uploaded successfully (mock)`, 'success');
        }, 1000);
      } else {
        console.log(`Uploading file to project ${selectedProject}:`, selectedFile);
        console.log('File type:', selectedFile.type);
        
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        // Step 1: Upload the file
        const uploadResponse = await apiService.uploadFile(selectedProject, selectedFile);
        console.log('Upload response:', uploadResponse);
        setUploading(false);
        
        // Show upload success message
        showNotification(`File "${selectedFile.name}" uploaded successfully! Processing...`, 'success');
        
        // Step 2: Process the uploaded file
        setProcessing(true);
        try {
          const processResponse = await apiService.processData(selectedProject);
          console.log('Process response:', processResponse);
          showNotification(`File "${selectedFile.name}" processed successfully! Indexing...`, 'success');
          
          // Step 3: Index the processed file
          setIndexing(true);
          try {
            const indexResponse = await apiService.pushToIndex(selectedProject);
            console.log('Index response:', indexResponse);
            showNotification(`File "${selectedFile.name}" uploaded, processed, and indexed successfully!`, 'success');
          } catch (indexError) {
            console.error('Error indexing file:', indexError);
            showNotification(`File uploaded and processed, but indexing failed: ${indexError.message}`, 'error');
          } finally {
            setIndexing(false);
          }
        } catch (processError) {
          console.error('Error processing file:', processError);
          showNotification(`File uploaded, but processing failed: ${processError.message}`, 'error');
        } finally {
          setProcessing(false);
        }
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (e) {
      console.error('Error uploading file:', e);
      showNotification(`Failed to upload file: ${e.message}`, 'error');
      setUploading(false);
      setProcessing(false);
      setIndexing(false);
    }
  };

  // Helper function to show notifications
  const showNotification = (message, type = 'error') => {
    setNotification(message);
    setNotificationType(type);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', pt: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {useMockProjects && (
        <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: '#fff3e0', border: '1px solid #ffe0b2' }}>
          <Typography color="warning.dark">
            Using demo projects because the projects API endpoint is not available. 
            {mockMode ? '' : ' Turn on Mock Mode for full demo functionality.'}
          </Typography>
        </Paper>
      )}
      
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Select Project</InputLabel>
            <Select
              value={selectedProject}
              label="Select Project"
              onChange={handleProjectSelect}
              sx={{ minWidth: 180 }}
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
          <Tooltip title={selectedProject ? "Upload PDF" : "Select a project first"}>
            <span>
              <IconButton
                color="primary"
                component="label"
                disabled={!selectedProject || uploading || processing || indexing}
                sx={{ ml: 1 }}
              >
                <AttachFileIcon />
                <input
                  type="file"
                  accept="application/pdf"
                  hidden
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </IconButton>
            </span>
          </Tooltip>
          {(uploading || processing || indexing) && 
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={24} sx={{ ml: 1 }} />
              <Typography variant="caption" sx={{ ml: 1 }}>
                {uploading ? 'Uploading...' : processing ? 'Processing...' : 'Indexing...'}
              </Typography>
            </Box>
          }
        </Box>
        
        {/* Top K Selector */}
        {selectedProject && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
            <Typography id="top-k-slider" gutterBottom mr={2}>
              Top K Chunks:
            </Typography>
            <Slider
              value={topK}
              onChange={handleTopKChange}
              aria-labelledby="top-k-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={10}
              sx={{ width: '150px', ml: 2, mr: 2 }}
            />
            <Typography variant="body2" color="text.secondary">
              {topK}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            label="New Project Name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            disabled={creatingProject}
            placeholder="Enter a name for your new project"
            helperText="Create a new project to upload and process files"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newProjectName.trim()) {
                e.preventDefault();
                handleCreateProject();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleCreateProject}
            disabled={!newProjectName.trim() || creatingProject}
            startIcon={creatingProject ? <CircularProgress size={20} /> : null}
            sx={{ height: 40 }}
          >
            Create
          </Button>
        </Box>
      </Paper>
      
      {/* Display chunks when available */}
      {showChunks && chunks.length > 0 && (
        <Paper elevation={2} sx={{ mb: 2, p: 1 }}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="chunks-content"
              id="chunks-header"
            >
              <Typography variant="subtitle1">Source Chunks ({chunks.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List sx={{ p: 0 }}>
                {chunks.map((chunk, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>
                          <DescriptionIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2">
                              {chunk.metadata?.source || `Chunk ${index + 1}`}
                              {chunk.metadata?.page && ` (Page ${chunk.metadata.page})`}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Score: {(chunk.score * 100).toFixed(2)}%
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{
                              display: 'inline',
                              backgroundColor: '#f5f5f5',
                              p: 1,
                              borderRadius: 1,
                              display: 'block',
                              whiteSpace: 'pre-wrap'
                            }}
                          >
                            {chunk.text}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < chunks.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Paper>
      )}
      
      <Paper elevation={1} sx={{ flexGrow: 1, p: 2, mb: 2, display: 'flex', flexDirection: 'column', minHeight: 400, maxHeight: 500, overflowY: 'auto', background: '#f9f9f9' }}>
        {loadingProjects ? (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Loading projects...
            </Typography>
          </Box>
        ) : selectedProject ? (
          chatHistory.length === 0 ? (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.7 }}>
              <SmartToyIcon sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
              <Typography variant="body1" color="text.secondary">
                Ask a question about your documents
              </Typography>
            </Box>
          ) : (
            <List>
              {chatHistory.map((message, index) => (
                <ListItem key={index} alignItems="flex-start" sx={{ flexDirection: message.role === 'user' ? 'row-reverse' : 'row', mb: 1 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main', ml: message.role === 'user' ? 2 : 0, mr: message.role === 'user' ? 0 : 2 }}>
                      {message.role === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <Paper sx={{ p: 2, maxWidth: '80%', backgroundColor: message.role === 'user' ? '#e3f2fd' : 'white' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.content}
                    </Typography>
                  </Paper>
                </ListItem>
              ))}
            </List>
          )
        ) : (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.7 }}>
            {projects.length === 0 ? (
              <>
                <UploadFileIcon sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
                <Typography variant="body1" color="text.secondary" align="center">
                  No projects found. Please create a project first.
                </Typography>
              </>
            ) : (
              <>
                <UploadFileIcon sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
                <Typography variant="body1" color="text.secondary">
                  Please select a project to start chatting and uploading files.
                </Typography>
              </>
            )}
          </Box>
        )}
      </Paper>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          placeholder={selectedProject ? "Type your question..." : "Select a project first"}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
          disabled={!selectedProject || loading}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && chatInput.trim()) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          disabled={!selectedProject || !chatInput.trim() || loading}
        >
          {loading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Box>
      {notification && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            mt: 2, 
            backgroundColor: notificationType === 'error' ? '#ffebee' : '#e8f5e9', 
            border: `1px solid ${notificationType === 'error' ? '#ffcdd2' : '#c8e6c9'}` 
          }}
        >
          <Typography color={notificationType === 'error' ? 'error' : 'success.dark'}>{notification}</Typography>
          <Button size="small" sx={{ mt: 1 }} onClick={() => setNotification(null)}>
            Dismiss
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default HomePage; 