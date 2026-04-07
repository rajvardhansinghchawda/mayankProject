import api from './api';

const userService = {
  getMe: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/users/profile/');
    return response.data;
  },

  getSections: async (params = {}) => {
    // If mine=true is passed, it filters by teacher assignments (as updated in backend)
    const response = await api.get('/users/sections/', { params });
    return response.data;
  },

  getDepartments: async () => {
    const response = await api.get('/users/departments/');
    return response.data;
  },
};

export default userService;
