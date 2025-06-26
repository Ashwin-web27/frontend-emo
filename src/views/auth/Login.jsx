import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:5000';
export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Debug: Log the request being sent
      console.log('Sending login request to:', `${API_URL}/api/v1/auth/login`);
      console.log('Request payload:', {
        email: formData.email,
        password: formData.password
      });

      // Call the employee login API
      const response = await axios.post(`${API_URL}/api/v1/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      // Debug: Log the response
      console.log('Login response:', response.data);

      if (response.data.success) {
        // Store token and user data in localStorage
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        navigate('/dashboard');
      }
    } catch (err) {
      // Enhanced error logging
      console.error('Login error:', err);
      console.error('Error response:', err.response);
      
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4" >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="bg-white py-8 px-8 border-b border-gray-100">
          <div className="flex justify-center my-4 ">
    <img
      src="/images/mr.png"
      alt="Logo"
      className="h-16 w-auto rounded-lg"
    />
  </div>
            <h2 className="text-center text-2xl font-light text-gray-700">
              Welcome back
            </h2>
            
            <p className="text-center text-gray-400 text-sm mt-2">
              Sign in to your employee account
            </p>
          </div>
          
          {/* Form */}
          <div className="p-8 pt-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-100 text-red-500 p-3 rounded-lg text-sm flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  minLength="6"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <Link 
                to="/signup" 
                className="text-sm font-medium text-indigo-500 hover:text-indigo-400 transition-colors duration-200"
              >
                Don't have an account? <span className="underline hover:no-underline">Sign up</span>
              </Link>
            </div>
            <div className="mt-6 flex justify-around text-center">
  <a 
    href="https://login.milkozapay.in/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-sm font-medium text-blue-600 hover:underline"
  >
    MilkozaPay
  </a>
  <a 
    href="https://ardcedu.org/signup" 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-sm font-medium text-green-600 hover:underline"
  >
    Education
  </a>
  <a 
    href="https://userardcore.netlify.app/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-sm font-medium text-purple-600 hover:underline"
  >
    Health Card
  </a>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}