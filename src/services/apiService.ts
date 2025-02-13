import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiService = {
  // Feuilles de travail
  uploadFeuilleTravail: async (cycleId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(`${API_BASE_URL}/feuilles-travail/${cycleId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteFeuilleTravail: async (id: string) => {
    return axios.delete(`${API_BASE_URL}/feuilles-travail/${id}`);
  },

  // Justificatifs
  uploadJustificatif: async (cycleId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(`${API_BASE_URL}/justificatifs/${cycleId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteJustificatif: async (id: string) => {
    return axios.delete(`${API_BASE_URL}/justificatifs/${id}`);
  }
};
