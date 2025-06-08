import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const PageContainer = ({ title, description, endpoint, children }) => {
  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      
      {description && (
        <Typography variant="body1" paragraph>
          {description}
        </Typography>
      )}
      
      {endpoint && (
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            mb: 3, 
            backgroundColor: '#f5f5f5',
            fontFamily: 'monospace',
            borderLeft: '4px solid #1976d2'
          }}
        >
          <Typography variant="body2" component="code">
            {endpoint}
          </Typography>
        </Paper>
      )}
      
      {children}
    </Box>
  );
};

export default PageContainer; 