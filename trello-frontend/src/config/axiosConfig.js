import axios from 'axios';

// Criação da instância global do Axios
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Base URL da API
});

// Intercepta as requisições para incluir o token no cabeçalho
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;