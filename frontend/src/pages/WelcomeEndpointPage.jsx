import React, { useState } from 'react';
import { Button, Box, CircularProgress } from '@mui/material';
import PageContainer from '../components/PageContainer';
import JsonDisplay from '../components/JsonDisplay';
import apiService from '../api/apiService';

const WelcomeEndpointPage = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTryIt = async () => {
    setLoading(true);
    try {
      // Mock API call
      setTimeout(() => {
        setResponse({
          app_name: "mini-rag",
          app_version: "0.1.0"
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setResponse({ error: error.message });
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Welcome Endpoint"
      description="Returns the application name and version."
      endpoint="GET /api/v1/"
    >
      <Box sx={{ mt: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleTryIt}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Try it'}
        </Button>
      </Box>

      {response && (
        <JsonDisplay data={response} title="Response" />
      )}
    </PageContainer>
  );
};

export default WelcomeEndpointPage; 