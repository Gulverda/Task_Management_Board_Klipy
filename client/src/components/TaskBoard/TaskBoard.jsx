import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskBoard = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/tasks')
            .then(response => setTasks(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="task_board">
            {['To Do', 'In Progress', 'Done'].map((status) => (
                <div key={status} className="column">
                    <h3>{status}</h3>
                    {tasks.filter(task => task.status === status).map(task => (
                        <div key={task.id} className="task_card">
                            <h4>{task.title}</h4>
                            <p>{task.description}</p>
                            <small>Due: {task.due_date}</small>
                            <p className="status">Status: {task.status}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default TaskBoard;