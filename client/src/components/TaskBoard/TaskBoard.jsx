import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Login from '../Auth/Login/Login';
import Register from '../Auth/Register/Register';

const TaskBoard = ({ isLoggedIn, onLoginSuccess }) => {
  const [tasks, setTasks] = useState([]);
  const [activeForm, setActiveForm] = useState('login');

  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get('http://127.0.0.1:8000/api/tasks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })
        .then((response) => setTasks(response.data))
        .catch((error) => console.error('Error fetching tasks:', error));
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
        ['To Do', 'In Progress', 'Done'].map((status) => (
          <div key={status} className="column">
            <h3>{status}</h3>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div key={task.id} className="task_card">
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <small>Due: {task.due_date}</small>
                  <p className="status">Status: {task.status}</p>
                </div>
              ))}
          </div>
        ))
      )}
    </div>
  );
};

export default TaskBoard;