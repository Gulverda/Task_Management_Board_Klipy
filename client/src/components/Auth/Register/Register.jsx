import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import Modal from '../../Modal/Modal';

const Register = ({ onRegisterSuccess = () => {} }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [errorMessages, setErrorMessages] = useState({});
  const [showModal, setShowModal] = useState(false);  // Modal visibility state

  const validatePassword = (password) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const hasLetter = /[a-zA-Z]/;
    if (password.length < minLength) {
      return 'Password must be at least 8 characters long.';
    }
    if (!hasNumber.test(password)) {
      return 'Password must contain at least one number.';
    }
    if (!hasSpecialChar.test(password)) {
      return 'Password must contain at least one special character.';
    }
    if (!hasLetter.test(password)) {
      return 'Password must contain at least one letter.';
    }
    return null; 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setErrorMessages({ password: [passwordError] });
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setErrorMessages({ password_confirmation: ['Passwords do not match.'] });
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData);

      setShowModal(true);  
      console.log('Registration successful:', response.data);

      setTimeout(() => {
        onRegisterSuccess(response.data.token);  
      }, 2000);

    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrorMessages(error.response.data.errors);
      } else {
        console.error('Registration error:', error);
      }
    }
  };

  return (
    <div className="center">
      <div className="register-form">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errorMessages.name && <p className="error">{errorMessages.name[0]}</p>}
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errorMessages.email && <p className="error">{errorMessages.email[0]}</p>}
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errorMessages.password && <p className="error">{errorMessages.password[0]}</p>}
          </div>

          <div>
            <label htmlFor="password_confirmation">Confirm Password</label>
            <input
              type="password"
              name="password_confirmation"
              id="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
            />
            {errorMessages.password_confirmation && (
              <p className="error">{errorMessages.password_confirmation[0]}</p>
            )}
          </div>

          <button type="submit">Register</button>
        </form>
      </div>

      {showModal && (
        <Modal
          message="Registration successful! Redirecting to login..."
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Register;
