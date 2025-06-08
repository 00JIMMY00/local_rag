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

const ProcessDataPage = () => {
  const [projectId, setProjectId] = useState('');
  const [fileId, setFileId] = useState('');
  const [chunkSize, setChunkSize] = useState(100);
  const [overlapSize, setOverlapSize] = useState(20);
  const [doReset, setDoReset] = useState(false);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleProcess = async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const options = {
        chunk_size: chunkSize,
        overlap_size: overlapSize,
        do_reset: doReset ? 1 : 0
      };
      
      if (fileId) {
        options.file_id = fileId;
      }
      
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
      description="Process uploaded files for a project, splitting them into chunks and storing them for later retrieval and search."
      endpoint="POST /api/v1/data/process/{project_id}"
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
          label="File ID (optional)"
          value={fileId}
          onChange={(e) => setFileId(e.target.value)}
          fullWidth
          margin="normal"
          helperText="If omitted, all files in the project are processed."
        />
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            label="Chunk Size"
            type="number"
            value={chunkSize}
            onChange={(e) => setChunkSize(Number(e.target.value))}
            fullWidth
            margin="normal"
            helperText="Default: 100"
          />
          
          <TextField
            label="Overlap Size"
            type="number"
            value={overlapSize}
            onChange={(e) => setOverlapSize(Number(e.target.value))}
            fullWidth
            margin="normal"
            helperText="Default: 20"
          />
        </Box>
        
        <FormControlLabel
          control={
            <Switch 
              checked={doReset} 
              onChange={(e) => setDoReset(e.target.checked)} 
            />
          }
          label={
            <Typography variant="body2">
              Reset (delete) previous chunks before processing
            </Typography>
          }
        />

        <Button 
          variant="contained" 
          onClick={handleProcess}
          disabled={loading || !projectId}
          startIcon={loading ? <CircularProgress size={24} /> : null}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? 'Processing...' : 'Process'}
        </Button>
      </Box>

      {response && (
        <JsonDisplay data={response} title="Response" />
      )}
    </PageContainer>
  );
};

export default ProcessDataPage; 