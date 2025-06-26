export default class Admin {
  constructor(data = {}) {
    this.email = data.email || '';
    this.password = data.password || '';
  }

  validateLogin() {
    if (!this.email || !this.password) {
      throw new Error('Email and password are required');
    }

    if (!this.isValidEmail(this.email)) {
      throw new Error('Please enter a valid email address');
    }
  }

  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  toJSON() {
    return {
      email: this.email,
      password: this.password
    };
  }
}