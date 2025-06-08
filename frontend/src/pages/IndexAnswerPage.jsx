import React, { useState } from 'react';
import { 
  Button, 
  Box, 
  TextField, 
  CircularProgress,
  Typography,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PageContainer from '../components/PageContainer';
import JsonDisplay from '../components/JsonDisplay';
import apiService from '../api/apiService';

const IndexAnswerPage = () => {
  const [projectId, setProjectId] = useState('');
  const [question, setQuestion] = useState('');
  const [limit, setLimit] = useState(5);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAsk = async () => {
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
      title="Index Answer (RAG)"
      description="Answers a question using Retrieval-Augmented Generation (RAG) over the indexed data for a project."
      endpoint="POST /api/v1/nlp/index/answer/{project_id}"
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
          label="Context Limit"
          type="number"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          fullWidth
          margin="normal"
          helperText="Maximum number of context chunks to use"
        />

        <Button 
          variant="contained" 
          onClick={handleAsk}
          disabled={loading || !projectId || !question}
          startIcon={loading ? <CircularProgress size={24} /> : <QuestionAnswerIcon />}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? 'Generating Answer...' : 'Ask Question'}
        </Button>
      </Box>

      {response && !response.error && (
        <Box sx={{ mt: 3 }}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Answer</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {response.answer || 'No answer generated'}
            </Typography>
          </Paper>

          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="response tabs">
                <Tab label="Full Prompt" />
                <Tab label="Chat History" />
                <Tab label="Raw Response" />
              </Tabs>
            </Box>
            <Box sx={{ p: 2 }}>
              {tabValue === 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Full Prompt</Typography>
                  <Paper elevation={1} sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                    <Typography variant="body2" component="pre" sx={{ 
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'monospace',
                      fontSize: '0.85rem'
                    }}>
                      {response.full_prompt || 'No prompt available'}
                    </Typography>
                  </Paper>
                </Box>
              )}
              {tabValue === 1 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Chat History</Typography>
                  <JsonDisplay data={response.chat_history || {}} />
                </Box>
              )}
              {tabValue === 2 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Raw Response</Typography>
                  <JsonDisplay data={response} />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {response && response.error && (
        <JsonDisplay data={response} title="Error" />
      )}
    </PageContainer>
  );
};

export default IndexAnswerPage; 