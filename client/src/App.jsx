import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TaskBoard from './components/TaskBoard/TaskBoard';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userName, setUserName] = useState('');
  const [isCreateTaskVisible, setIsCreateTaskVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedName = localStorage.getItem('userName');

    if (token && storedName) {
      setIsLoggedIn(true);
      setUserName(storedName);
    }
  }, []);

  const handleLoginSuccess = (name) => {
    setIsLoggedIn(true);
    setUserName(name);
    localStorage.setItem('userName', name);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName('');
  };

  const handleLoginClick = () => {
    setShowRegister(false);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <Navbar
          userName={isLoggedIn ? userName : null}
          onLogout={handleLogout}
          onCreateTask={() => setIsCreateTaskVisible(true)}
          onLoginClick={handleLoginClick}
          onRegisterClick={handleRegisterClick}
          isLoggedIn={isLoggedIn}
        />

        {!isLoggedIn ? (
          <div className="auth_section">
            <h2>Welcome! Please log in or register to access your tasks.</h2>
            {showRegister ? (
              <Register />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )}
          </div>
        ) : (
          <TaskBoard
            isLoggedIn={isLoggedIn}
            onCreateTask={isCreateTaskVisible}
            onCloseCreateTask={() => setIsCreateTaskVisible(false)}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default App;
