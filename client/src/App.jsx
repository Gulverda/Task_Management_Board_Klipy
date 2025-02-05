import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
  
    console.log("Retrieved userName from localStorage:", storedName);
  
    if (token && storedName) {
      setIsLoggedIn(true);
      setUserName(storedName);
    }
  }, [isLoggedIn]); 
  
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;


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
    <Router>
    <DndProvider
    backend={isTouchDevice ? TouchBackend : HTML5Backend}
    options={isTouchDevice ? { enableMouseEvents: true, preventScroll: true } : {}}
  >        <div>
          <Navbar
            userName={isLoggedIn ? userName : null}
            onLogout={handleLogout}
            onCreateTask={() => setIsCreateTaskVisible(true)}
            onLoginClick={handleLoginClick}
            onRegisterClick={handleRegisterClick}
            isLoggedIn={isLoggedIn}
          />
          
          <Routes>
            {/* Public Route for Login/Register */}
            <Route path="/" element={!isLoggedIn ? (
              <div className="auth_section">
                <h2>Welcome! Please log in or register to access your tasks.</h2>
                {showRegister ? (
                  <Register />
                ) : (
                  <Login onLoginSuccess={handleLoginSuccess} />
                )}
              </div>
            ) : <Navigate to="/taskboard" />} />
            
            {/* Private Route for TaskBoard */}
            <Route path="/taskboard" element={isLoggedIn ? (
              <TaskBoard
                isLoggedIn={isLoggedIn}
                onCreateTask={isCreateTaskVisible}
                onCloseCreateTask={() => setIsCreateTaskVisible(false)}
              />
            ) : <Navigate to="/" />} />
          </Routes>
        </div>
      </DndProvider>
    </Router>
  );
};

export default App;
