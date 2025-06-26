import Employee from '../models/Employee';
import User from '../models/User';
import jwt from 'jsonwebtoken';

class AuthController {
  // Employee Authentication
  static async employeeLogin(credentials) {
    try {
      // Validate required fields
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      // Find employee
      const employee = await Employee.findOne({ email: credentials.email }).select('+password');
      
      if (!employee) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isMatch = await employee.matchPassword(credentials.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      // Generate token
      const token = jwt.sign(
        { id: employee._id, role: 'employee' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      // Remove password from response
      employee.password = undefined;

      return {
        success: true,
        token,
        data: {
          id: employee._id,
          fullName: employee.fullName,
          email: employee.email,
          role: 'employee'
        }
      };
    } catch (error) {
      console.error('Employee login error:', error.message);
      throw error;
    }
  }

  // Employee Registration
  static async employeeRegister(employeeData) {
    try {
      // Check if passwords match
      if (employeeData.password !== employeeData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Create employee
      const employee = await Employee.create({
        fullName: employeeData.fullName,
        email: employeeData.email,
        password: employeeData.password
      });

      // Generate token
      const token = jwt.sign(
        { id: employee._id, role: 'employee' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      return {
        success: true,
        token,
        data: {
          id: employee._id,
          fullName: employee.fullName,
          email: employee.email,
          role: 'employee'
        }
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Email already exists');
      }
      console.error('Employee registration error:', error.message);
      throw error;
    }
  }

  // User Registration (with optional employee referral)
  static async userRegister(userData) {
    try {
      // Validate required fields
      if (!userData.firstName || !userData.lastName || !userData.email || 
          !userData.phoneNumber || !userData.age || !userData.city || !userData.password) {
        throw new Error('All required fields must be provided');
      }

      // Check referral if provided
      if (userData.referral) {
        const referringEmployee = await Employee.findById(userData.referral);
        if (!referringEmployee) {
          throw new Error('Referral employee not found');
        }
      }

      // Create user
      const user = await User.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        age: userData.age,
        city: userData.city,
        password: userData.password,
        referral: userData.referral || null
      });

      // Generate token
      const token = jwt.sign(
        { id: user._id, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      return {
        success: true,
        token,
        data: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          age: user.age,
          city: user.city,
          referral: user.referral,
          role: 'user'
        }
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Email already exists');
      }
      console.error('User registration error:', error.message);
      throw error;
    }
  }

  // Get current authenticated user/employee
  static async getMe(userId, isEmployee = false) {
    try {
      if (isEmployee) {
        const employee = await Employee.findById(userId);
        if (!employee) {
          throw new Error('Employee not found');
        }
        return {
          success: true,
          data: {
            id: employee._id,
            fullName: employee.fullName,
            email: employee.email,
            role: 'employee'
          }
        };
      } else {
        const user = await User.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
        return {
          success: true,
          data: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            age: user.age,
            city: user.city,
            referral: user.referral,
            role: 'user'
          }
        };
      }
    } catch (error) {
      console.error('Get me error:', error.message);
      throw error;
    }
  }
}

export default AuthController;