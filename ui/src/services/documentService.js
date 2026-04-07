import api from './api';

const documentService = {
  getDocuments: async (params = {}) => {
    const response = await api.get('/documents/', { params });
    return response.data;
  },

  getMyDocuments: async () => {
    const response = await api.get('/documents/my-uploads/');
    return response.data;
  },

  uploadDocument: async (formData) => {
    // Note: FormData should contain 'pdf_data', 'title', 'section', 'document_type', etc.
    const response = await api.post('/documents/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteDocument: async (id) => {
    const response = await api.delete(`/documents/${id}/manage/`);
    return response.data;
  },

  getDocumentDetail: async (id) => {
    const response = await api.get(`/documents/${id}/`);
    return response.data;
  },
};

export default documentService;
