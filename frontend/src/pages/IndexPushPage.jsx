import React, { useState } from 'react';
import { 
  Button, 
  Box, 
  TextField, 
  CircularProgress, 
  FormControlLabel,
  Switch,
  Typography
} from '@mui/material';
import PageContainer from '../components/PageContainer';
import JsonDisplay from '../components/JsonDisplay';
import apiService from '../api/apiService';

const IndexPushPage = () => {
  const [projectId, setProjectId] = useState('');
  const [doReset, setDoReset] = useState(false);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePush = async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const options = {
        do_reset: doReset ? 1 : 0
      };
      
      const result = await apiService.pushToIndex(projectId, options);
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
      description="Indexes the processed chunks of a project into the vector database."
      endpoint="POST /api/v1/nlp/index/push/{project_id}"
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
        
        <FormControlLabel
          control={
            <Switch 
              checked={doReset} 
              onChange={(e) => setDoReset(e.target.checked)} 
            />
          }
          label={
            <Typography variant="body2">
              Reset the vector collection before indexing
            </Typography>
          }
        />

        <Button 
          variant="contained" 
          onClick={handlePush}
          disabled={loading || !projectId}
          startIcon={loading ? <CircularProgress size={24} /> : null}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? 'Indexing...' : 'Push to Index'}
        </Button>
      </Box>

      {response && (
        <JsonDisplay data={response} title="Response" />
      )}
    </PageContainer>
  );
};

export default IndexPushPage; 