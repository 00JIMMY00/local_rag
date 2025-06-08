import axios from 'axios';

const API_BASE_URL = '/api/v1';

const apiService = {
  // Welcome endpoint
  getWelcome: async () => {
    return axios.get(`${API_BASE_URL}/`);
  },

  // Upload Data
  uploadFile: async (projectId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_BASE_URL}/data/upload/${projectId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Process Data
  processData: async (projectId, options = {}) => {
    return axios.post(`${API_BASE_URL}/data/process/${projectId}`, options);
  },

  // Index Push
  pushToIndex: async (projectId, options = {}) => {
    return axios.post(`${API_BASE_URL}/nlp/index/push/${projectId}`, options);
  },

  // Index Info
  getIndexInfo: async (projectId) => {
    return axios.get(`${API_BASE_URL}/nlp/index/info/${projectId}`);
  },

  // Index Search
  searchIndex: async (projectId, text, limit = 5) => {
    return axios.post(`${API_BASE_URL}/nlp/index/search/${projectId}`, { text, limit });
  },

  // Index Answer (RAG)
  getAnswer: async (projectId, text, limit = 5) => {
    return axios.post(`${API_BASE_URL}/nlp/index/answer/${projectId}`, { text, limit });
  },

  // Get all project IDs (as per PRD)
  getProjects: async () => {
    return axios.get(`${API_BASE_URL}/projects/`);
  },

  // Create a new project (not in PRD, but kept for future use)
  createProject: async (projectName) => {
    return axios.post(`${API_BASE_URL}/projects`, { name: projectName });
  }
};

export default apiService; 