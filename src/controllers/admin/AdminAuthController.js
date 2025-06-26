import Admin from '../../models/admin/Admin';
import AdminAuthService from '../../services/AdminAuthService';

class AdminAuthController {
  static async login(adminData) {
    try {
      const admin = new Admin(adminData);
      admin.validateLogin();
      
      const response = await AdminAuthService.login(admin.toJSON());
      AdminAuthService.setAuthData(response);
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  static logout() {
    AdminAuthService.logout();
  }

  static checkAuth() {
    return AdminAuthService.isAuthenticated();
  }

  static getCurrentAdmin() {
    return AdminAuthService.getCurrentAdmin();
  }
}

export default AdminAuthController;