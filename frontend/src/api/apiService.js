import axios from 'axios';

const baseURL = `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_BASE_PATH}`;

const apiClient = axios.create({
  baseURL: baseURL,
});

const apiService = {
  // Welcome endpoint
  getWelcome: async () => {
    return apiClient.get('/');
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
      const response = await apiClient.post(`/data/upload/${projectId}`, formData, {
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
    return apiClient.post(`/data/process/${projectId}`, options);
  },

  // Index Push
  pushToIndex: async (projectId, options = {}) => {
    return apiClient.post(`/nlp/index/push/${projectId}`, options);
  },

  // Index Info
  getIndexInfo: async (projectId) => {
    return apiClient.get(`/nlp/index/info/${projectId}`);
  },

  // Index Search
  searchIndex: async (projectId, text, limit = 5) => {
    return apiClient.post(`/nlp/index/search/${projectId}`, { text, limit });
  },

  // Index Answer (RAG)
  getAnswer: async (projectId, text, limit = 5) => {
    return apiClient.post(`/nlp/index/answer/${projectId}`, { text, limit });
  },

  // Get all projects with their names
  getProjects: async () => {
    return apiClient.get('/projects/');
  },

  // Create a new project - try without trailing slash first, then with if it fails
  createProject: async (projectName) => {
    try {
      return await apiClient.post('/projects', { name: projectName });
    } catch (error) {
      if (error.response && error.response.status === 307) {
        // If we get a redirect, try with trailing slash
        return apiClient.post('/projects/', { name: projectName });
      }
      throw error;
    }
  },

  // Get project details
  getProject: async (projectId) => {
    return apiClient.get(`/projects/${projectId}`);
  },

  // Update project name
  updateProjectName: async (projectId, name) => {
    return apiClient.put(`/projects/${projectId}/name`, { name });
  }
};

export default apiService; 