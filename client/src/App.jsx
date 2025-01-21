import React, { useState, useEffect } from 'react';
import TaskBoard from './components/TaskBoard/TaskBoard';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <div className="auth_section">
          <h2>Welcome! Please log in or register to access your tasks.</h2>
          <div>
            <button onClick={() => setShowRegister(false)}>Login</button>
            <button onClick={() => setShowRegister(true)}>Register</button>
          </div>
          {showRegister ? (
            <Register />
          ) : (
            <Login onLoginSuccess={handleLoginSuccess} />
          )}
        </div>
      ) : (
        <div>
          <TaskBoard isLoggedIn={isLoggedIn} />
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default App;
