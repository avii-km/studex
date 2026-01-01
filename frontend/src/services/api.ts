import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getStudents = async () => {
    const response = await api.get('/view');
    return response.data;
};

export const getStudent = async (id: string) => {
    const response = await api.get(`/student/${id}`);
    return response.data;
};

export const addStudent = async (student: any) => {
    const response = await api.post('/add', student);
    return response.data;
};

export const updateStudent = async (id: string, student: any) => {
    const response = await api.put(`/edit/${id}`, student);
    return response.data;
};

export const deleteStudent = async (id: string) => {
    const response = await api.delete(`/delete/${id}`);
    return response.data;
};

export const sortStudents = async (sortBy: string, order: 'asc' | 'desc') => {
    const response = await api.get(`/sort?sort_by=${sortBy}&order=${order}`);
    return response.data;
};

export default api;
