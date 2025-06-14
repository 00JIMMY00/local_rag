import axios from 'axios';

const API_URL = (window.env && window.env.VITE_API_URL) || import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_PATH = (window.env && window.env.VITE_API_BASE_PATH) || import.meta.env.VITE_API_BASE_PATH || '/api/v1';
const API_BASE_URL = `${API_URL}${API_BASE_PATH}`;

const apiService = {
  // Welcome endpoint
  getWelcome: async () => {
    return axios.get(`${API_BASE_URL}/`);
  },

  // Upload Data
  uploadFile: async (projectId, file) => {
    console.log(`API Service: Uploading file to project ${projectId}`, file);
    
    const formData = new FormData();
    formData.append('file', file);
    
    // Log the FormData contents
    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }
    
    try {
      const response = await axios.post(`${API_BASE_URL}/data/upload/${projectId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload response:', response);
      return response;
    } catch (error) {
      console.error('Upload error:', error.response || error);
      throw error;
    }
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

  // Get all projects with their names
  getProjects: async () => {
    return axios.get(`${API_BASE_URL}/projects/`);
  },

  // Create a new project - try without trailing slash first, then with if it fails
  createProject: async (projectName) => {
    try {
      return await axios.post(`${API_BASE_URL}/projects`, { name: projectName });
    } catch (error) {
      if (error.response && error.response.status === 307) {
        // If we get a redirect, try with trailing slash
        return axios.post(`${API_BASE_URL}/projects/`, { name: projectName });
      }
      throw error;
    }
  },

  // Get project details
  getProject: async (projectId) => {
    return axios.get(`${API_BASE_URL}/projects/${projectId}`);
  },

  // Update project name
  updateProjectName: async (projectId, name) => {
    return axios.put(`${API_BASE_URL}/projects/${projectId}/name`, { name });
  }
};

export default apiService; 