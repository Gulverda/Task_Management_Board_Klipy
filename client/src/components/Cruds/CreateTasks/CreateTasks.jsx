import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateTasks.css';

const CreateTask = ({ onClose, onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 24);
    setDueDate(currentDate.toISOString().slice(0, 10));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (token) {
      axios
        .post(
          'http://127.0.0.1:8000/api/tasks',
          {
            title,
            description,
            due_date: dueDate,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          onTaskCreated(response.data);
          alert("🎯 Stay focused, create more tasks, and achieve your goals!");
          onClose();
        })
        .catch((error) => {
          console.error('Error creating task:', error);
        });
    }
  };

  return (
    <div className="create_task">
      <h2>Create a New Task</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled
          />
        </div>
        <button type="submit">Create Task</button>
      </form>
      <button onClick={onClose} className="close-btn">Close</button>
    </div>
  );
};

export default CreateTask;
