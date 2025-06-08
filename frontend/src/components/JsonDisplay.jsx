import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const JsonDisplay = ({ data, title }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2, mb: 2, maxWidth: '100%', overflow: 'auto' }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      <Box
        component="pre"
        sx={{
          p: 1,
          backgroundColor: '#f5f5f5',
          borderRadius: 1,
          overflow: 'auto',
          maxHeight: '400px',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#bdbdbd',
            borderRadius: '4px',
          },
        }}
      >
        {JSON.stringify(data, null, 2)}
      </Box>
    </Paper>
  );
};

export default JsonDisplay; 