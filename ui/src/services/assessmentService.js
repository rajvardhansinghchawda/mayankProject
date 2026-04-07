import api from './api';

const assessmentService = {
  getTests: async (params = {}) => {
    const response = await api.get('/assessments/tests/', { params });
    const data = response.data?.results ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  getTestDetail: async (id) => {
    const response = await api.get(`/assessments/tests/${id}/`);
    return response.data;
  },

  createTest: async (testData) => {
    const response = await api.post('/assessments/tests/', testData);
    return response.data;
  },

  updateTest: async (id, testData) => {
    const response = await api.patch(`/assessments/tests/${id}/`, testData);
    return response.data;
  },

  deleteTest: async (id) => {
    const response = await api.delete(`/assessments/tests/${id}/`);
    return response.data;
  },

  publishTest: async (id) => {
    const response = await api.post(`/assessments/tests/${id}/publish/`);
    return response.data;
  },

  getSubmissions: async (id) => {
    const response = await api.get(`/assessments/tests/${id}/submissions/`);
    return response.data;
  },

  getTestAttempts: async (params = {}) => {
    const response = await api.get('/assessments/attempts/', { params });
    return response.data;
  },

  // ===== Question Builder Methods =====
  getTestQuestions: async (testId) => {
    const response = await api.get(`/assessments/tests/${testId}/questions/`);
    return response.data;
  },

  addQuestion: async (testId, questionData) => {
    const response = await api.post(`/assessments/tests/${testId}/questions/`, questionData);
    return response.data;
  },

  updateQuestion: async (testId, questionId, questionData) => {
    const response = await api.patch(`/assessments/tests/${testId}/questions/${questionId}/`, questionData);
    return response.data;
  },

  deleteQuestion: async (testId, questionId) => {
    const response = await api.delete(`/assessments/tests/${testId}/questions/${questionId}/`);
    return response.data;
  },
};


export default assessmentService;

