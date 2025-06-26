import api from '../utils/api';
import { ADMIN_API_BASE_URL } from '../utils/constants';

class AdminAuthService {
  static async login(adminCredentials) {
    try {
      const response = await api.post(`${ADMIN_API_BASE_URL}/api/admin/login`, adminCredentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.msg || 'Admin login failed');
    }
  }

  static logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  }

  static isAuthenticated() {
    return !!localStorage.getItem('adminToken');
  }

  static getCurrentAdmin() {
    const adminData = localStorage.getItem('adminData');
    return adminData ? JSON.parse(adminData) : null;
  }

  static setAuthData(data) {
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminData', JSON.stringify(data.admin));
  }
}

export default AdminAuthService;