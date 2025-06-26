import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FiUserPlus, 
  FiMail, 
  FiLock, 
  FiUser, 
  FiArrowLeft, 
  FiKey,
  FiCheckCircle,
  FiArrowRight
} from 'react-icons/fi';

const API_URL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:5000/api/v1';
const idWithQuotes = localStorage.getItem("subadmin-id");
const idWithoutQuotes = idWithQuotes ? idWithQuotes.replace(/^"(.*)"$/, '$1') : '';


console.log(idWithoutQuotes);  // Output: 6839e2bcd2202088b8d8d09f

const AddEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode:idWithoutQuotes
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Load current user data on component mount
  useEffect(() => {
    const loadUserData = () => {
      const userData = localStorage.getItem('user');
      if (!userData) return;

      try {
        const parsedUser = JSON.parse(userData);
        setCurrentUser(parsedUser);
        
        if (parsedUser.referralCode) {
          setFormData(prev => ({
            ...prev,
            referralCode: parsedUser.referralCode
          }));
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    };

    loadUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/register-employee`, {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword:formData.confirmPassword,
        referralCode: localStorage.getItem("subadmin-token") || undefined
      });

      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         'Employee registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Success state component
  if (success) {
    return (
      <SuccessView 
        onAddAnother={() => setSuccess(false)}
        onDashboard={() => navigate('/dashboard')}
      />
    );
  }

  // Main form component
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden" 
           style={{ width: '80%', maxWidth: '800px' }}>
        
        <Header onBack={() => navigate(-1)} />
        
        <div className="p-8">
          {error && <ErrorDisplay message={error} />}
          
          <EmployeeForm 
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            hasReferralCode={!!formData.referralCode}
          />
        </div>
      </div>
    </div>
  );
};

// Sub-components for better organization

const SuccessView = ({ onAddAnother, onDashboard }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden" 
         style={{ width: '80%' }}>
      <div className="p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <FiCheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Employee Added Successfully!
        </h2>
        <p className="text-gray-600 mb-6">
          The new employee can now access the system.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={onAddAnother}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Add Another
          </button>
          <button
            onClick={onDashboard}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Header = ({ onBack }) => (
  <div className="bg-indigo-600 text-white p-6">
    <div className="flex items-center justify-between">
      <button 
        onClick={onBack}
        className="flex items-center text-indigo-100 hover:text-white transition-colors"
      >
        <FiArrowLeft className="mr-2" />
        Back
      </button>
      <h2 className="text-2xl font-semibold">Add New Employee</h2>
      <div className="w-8"></div>
    </div>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
    <div className="flex items-center">
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <span>{message}</span>
    </div>
  </div>
);

const EmployeeForm = ({ formData, onChange, onSubmit, isLoading, hasReferralCode }) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormInput
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={onChange}
        placeholder="John Doe"
        icon={<FiUser />}
        required
      />

      <FormInput
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={onChange}
        placeholder="employee@company.com"
        icon={<FiMail />}
        required
        colSpan={2}
      />

      <FormInput
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={onChange}
        placeholder="••••••••"
        icon={<FiLock />}
        required
        minLength="6"
      />

      <FormInput
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={onChange}
        placeholder="••••••••"
        icon={<FiLock />}
        required
        minLength="6"
      />

      <div className="col-span-2">
        <FormInput
          label="Referral Code"
          name="referralCode"
          value={formData.referralCode}
          onChange={onChange}
          placeholder="Auto-populated from your account"
          icon={<FiKey />}
          readOnly
          disabled={!hasReferralCode}
        />
        {!hasReferralCode && (
          <p className="mt-1 text-sm text-gray-500">
            No referral code associated with your account
          </p>
        )}
      </div>
    </div>

    <FormActions isLoading={isLoading} />
  </form>
);

const FormInput = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  icon, 
  colSpan = 1,
  ...props 
}) => (
  <div className={`col-span-${colSpan}`}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
          props.readOnly ? 'bg-gray-50' : ''
        }`}
        placeholder={placeholder}
        {...props}
      />
    </div>
  </div>
);

const FormActions = ({ isLoading }) => (
  <div className="flex items-center justify-between">
    <button
      type="submit"
      disabled={isLoading}
      className="flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      <FiUserPlus className="mr-2" />
      {isLoading ? 'Adding Employee...' : 'Add Employee'}
    </button>
    
    <Link 
      to="/subadmin/manage-employees"
      className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
    >
      View all employees
    </Link>
  </div>
);

export default AddEmployee;