import React, { useState } from 'react';
import { 
  Button, 
  Box, 
  TextField, 
  CircularProgress
} from '@mui/material';
import PageContainer from '../components/PageContainer';
import JsonDisplay from '../components/JsonDisplay';
import apiService from '../api/apiService';

const IndexInfoPage = () => {
  const [projectId, setProjectId] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchInfo = async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const result = await apiService.getIndexInfo(projectId);
      setResponse(result.data);
    } catch (error) {
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Index Info"
      description="Retrieves information about the vector database collection for a project."
      endpoint="GET /api/v1/nlp/index/info/{project_id}"
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

        <Button 
          variant="contained" 
          onClick={handleFetchInfo}
          disabled={loading || !projectId}
          startIcon={loading ? <CircularProgress size={24} /> : null}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? 'Fetching...' : 'Fetch Info'}
        </Button>
      </Box>

      {response && (
        <JsonDisplay data={response} title="Response" />
      )}
    </PageContainer>
  );
};

export default IndexInfoPage; 