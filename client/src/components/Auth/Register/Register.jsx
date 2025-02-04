import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'

const Register = ({ onRegisterSuccess = () => {} }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [errorMessages, setErrorMessages] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData);

      onRegisterSuccess(response.data.token);
      console.log('Registration successful:', response.data);
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
    </div>
  );
};

export default Register;
