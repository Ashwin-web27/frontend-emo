import { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isEmployee: false  // To distinguish between user and employee
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = JSON.parse(localStorage.getItem('user'));
        const isEmployee = localStorage.getItem('isEmployee') === 'true';

        if (token && userData) {
          // Optional: Verify token with backend
          setAuthState({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            isEmployee
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials, isEmployeeLogin = false) => {
    try {
      const data = await AuthService.login(credentials, isEmployeeLogin);
      
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || data.employee));
      localStorage.setItem('isEmployee', isEmployeeLogin.toString());

      setAuthState({
        user: data.user || data.employee,
        isAuthenticated: true,
        isLoading: false,
        isEmployee: isEmployeeLogin
      });

      return data;
    } catch (error) {
      throw error;
    }
  };

  const registerEmployee = async (employeeData) => {
    try {
      const data = await AuthService.registerEmployee(employeeData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const registerUser = async (userData) => {
    try {
      const data = await AuthService.registerUser(userData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isEmployee: false
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        registerEmployee,
        registerUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);