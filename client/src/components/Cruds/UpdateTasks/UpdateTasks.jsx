import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateTask = ({ task, onClose, onTaskUpdated }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.due_date);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.due_date);
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (token) {
      axios
        .put(
          `http://127.0.0.1:8000/api/tasks/${task.id}`,
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
          onTaskUpdated(response.data);
          alert("Update Successfully!!!") 
          onClose(); 
        })
        .catch((error) => {
          console.error('Error updating task:', error);
        });
    }
  };

  return (
    <div className="update_task">
      <h2>Edit Task</h2>
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
        <button type="submit">Update Task</button>
      </form>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default UpdateTask;
