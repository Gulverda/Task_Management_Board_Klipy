import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Login from '../Auth/Login/Login';
import Register from '../Auth/Register/Register';

const TaskBoard = ({ isLoggedIn, onLoginSuccess }) => {
  const [tasks, setTasks] = useState([]);
  const [activeForm, setActiveForm] = useState('login');

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem('authToken');
      if (token) {
        axios
          .get('http://127.0.0.1:8000/api/tasks', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setTasks(response.data);
            // console.log('Fetched tasks:', response.data); 
          })
          .catch((error) => console.error('Error fetching tasks:', error));
      }
    }
  }, [isLoggedIn]);

  return (
    <div className="task_board">
      {!isLoggedIn ? (
        <div className="auth_section">
          <h2>Welcome! Please log in or register to access your tasks.</h2>
          <div>
            <button onClick={() => setActiveForm('login')}>Login</button>
            <button onClick={() => setActiveForm('register')}>Register</button>
          </div>
          {activeForm === 'login' && <Login onLoginSuccess={onLoginSuccess} />}
          {activeForm === 'register' && <Register />}
        </div>
      ) : (
        <div>
          {tasks.length === 0 ? (
            <p>No tasks available for this user.</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="task_card">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <small>Due: {task.due_date}</small>
                <p className="status">Assigned User ID: {task.assigned_user_id}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
