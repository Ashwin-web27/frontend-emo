import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:5000/api/v1';

const AuthService = {
  async login(credentials, isEmployee = false) {
    const endpoint = isEmployee ? '/auth/login' : '/users/login'; // Adjust based on your API
    const response = await axios.post(`${API_URL}${endpoint}`, credentials);
    return response.data;
  },

  async registerEmployee(employeeData) {
    const response = await axios.post(`${API_URL}/auth/register`, employeeData);
    return response.data;
  },

  async registerUser(userData) {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isEmployee');
  },

  // Optional: Token verification
  async verifyToken(token) {
    const response = await axios.get(`${API_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export default AuthService;