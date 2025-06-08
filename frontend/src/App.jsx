import React, { useState } from 'react';
import { Box, Tabs, Tab, AppBar, Toolbar, Typography, Switch, FormControlLabel, IconButton, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import WelcomeIcon from '@mui/icons-material/Info';
import UploadIcon from '@mui/icons-material/CloudUpload';
import ProcessIcon from '@mui/icons-material/Settings';
import IndexPushIcon from '@mui/icons-material/Send';
import IndexInfoIcon from '@mui/icons-material/InfoOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AnswerIcon from '@mui/icons-material/QuestionAnswer';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

// Pages
import HomePage from './pages/HomePage';
import WelcomeEndpointPage from './pages/WelcomeEndpointPage';
import UploadDataPage from './pages/UploadDataPage';
import ProcessDataPage from './pages/ProcessDataPage';
import IndexPushPage from './pages/IndexPushPage';
import IndexInfoPage from './pages/IndexInfoPage';
import IndexSearchPage from './pages/IndexSearchPage';
import IndexAnswerPage from './pages/IndexAnswerPage';

const tabList = [
  { icon: <HomeIcon />, label: 'Home' },
  { icon: <WelcomeIcon />, label: 'Welcome' },
  { icon: <UploadIcon />, label: 'Upload' },
  { icon: <ProcessIcon />, label: 'Process' },
  { icon: <IndexPushIcon />, label: 'Index Push' },
  { icon: <IndexInfoIcon />, label: 'Index Info' },
  { icon: <SearchIcon />, label: 'Search' },
  { icon: <AnswerIcon />, label: 'Answer' },
];

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [mockMode, setMockMode] = useState(false);
  const [showTabNames, setShowTabNames] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMockModeChange = (event) => {
    setMockMode(event.target.checked);
  };

  const handleToggleTabNames = () => {
    setShowTabNames((prev) => !prev);
  };

  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return <HomePage mockMode={mockMode} />;
      case 1:
        return <WelcomeEndpointPage mockMode={mockMode} />;
      case 2:
        return <UploadDataPage mockMode={mockMode} />;
      case 3:
        return <ProcessDataPage mockMode={mockMode} />;
      case 4:
        return <IndexPushPage mockMode={mockMode} />;
      case 5:
        return <IndexInfoPage mockMode={mockMode} />;
      case 6:
        return <IndexSearchPage mockMode={mockMode} />;
      case 7:
        return <IndexAnswerPage mockMode={mockMode} />;
      default:
        return <HomePage mockMode={mockMode} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Mini-RAG
          </Typography>
          <Tooltip title={showTabNames ? 'Hide Tab Names' : 'Show Tab Names'}>
            <IconButton color="inherit" onClick={handleToggleTabNames}>
              <MenuOpenIcon />
            </IconButton>
          </Tooltip>
          <FormControlLabel
            control={
              <Switch
                checked={mockMode}
                onChange={handleMockModeChange}
                color="secondary"
              />
            }
            label="Mock Mode"
            sx={{ color: 'white', ml: 2 }}
          />
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexGrow: 1, height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        {/* Content Area */}
        <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto', height: '100%' }}>
          {renderTabContent()}
        </Box>
        {/* Vertical Tabs on right side */}
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderLeft: 1,
            borderColor: 'divider',
            width: showTabNames ? 180 : 80,
            background: '#f8f9fa',
            '& .MuiTab-root': {
              minWidth: showTabNames ? 180 : 80,
              minHeight: '80px',
              justifyContent: showTabNames ? 'flex-start' : 'center',
              pl: showTabNames ? 2 : 0,
              pr: showTabNames ? 2 : 0,
              transition: 'all 0.2s',
            },
          }}
        >
          {tabList.map((tab, idx) => (
            <Tab
              key={tab.label}
              icon={tab.icon}
              label={showTabNames ? tab.label : ''}
              aria-label={tab.label}
            />
          ))}
        </Tabs>
      </Box>
    </Box>
  );
}

export default App; 