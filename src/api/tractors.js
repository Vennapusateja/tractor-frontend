import API from './axios';

export const getAllTractors = (params) => API.get('/tractors/', { params });
export const getMyTractors  = ()       => API.get('/tractors/mine/');
export const getTractor     = (id)     => API.get(`/tractors/${id}/`);
export const createTractor  = (data)   => API.post('/tractors/', data);
export const updateTractor  = (id, data) => API.patch(`/tractors/${id}/`, data);
export const deleteTractor  = (id)     => API.delete(`/tractors/${id}/`);