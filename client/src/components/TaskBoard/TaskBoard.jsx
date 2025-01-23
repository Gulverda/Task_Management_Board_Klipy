import React, { useEffect, useState } from "react";
import axios from "axios";
import Login from "../Auth/Login/Login";
import Register from "../Auth/Register/Register";
import UpdateTask from "../Cruds/UpdateTasks/UpdateTasks";
import Delete from "../Cruds/DeleteTasks/Delete";
import { useDrag, useDrop } from "react-dnd";
import EditIcon from "../../assets/edit.svg";
import "./TaskBoard.css";
import "../../../src/App.css";

const TaskBoard = ({ isLoggedIn, onLoginSuccess }) => {
  const [tasks, setTasks] = useState([]);
  const [activeForm, setActiveForm] = useState("login");
  const [showEditTask, setShowEditTask] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    const fetchTasks = () => {
      if (isLoggedIn) {
        const token = localStorage.getItem("authToken");
        if (token) {
          axios
            .get("http://127.0.0.1:8000/api/tasks", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              setTasks(response.data);
            })
            .catch((error) => console.error("Error fetching tasks:", error));
        }
      }
    };

    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);

    return () => clearInterval(interval); 
  }, [isLoggedIn]);

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setShowEditTask(true);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setShowEditTask(false);
  };

  const handleTaskDeleted = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleDrop = (taskId, newStatus) => {
    const normalizedStatus =
      newStatus === "In Progress" ? "in_progress" : newStatus.toLowerCase();

    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: normalizedStatus } : task
    );
    setTasks(updatedTasks);

    const token = localStorage.getItem("authToken");
    if (token) {
      axios
        .put(
          `http://127.0.0.1:8000/api/tasks/${taskId}`,
          { status: normalizedStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log("Task status updated successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error updating task status:", error.response.data);
        });
    }
  };

  // Task with drag-and-drop function
  const Task = ({ task }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "TASK",
      item: { id: task.id, status: task.status },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    return (
      <div
        ref={drag}
        className="task_card"
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <div className="card_texts">
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          {/* <small>Due: {task.due_date}</small> */}
          <p>Status: {task.status}</p>
          {/* <p className="status">Assigned User ID: {task.assigned_user_id}</p> */}
        </div>
        <div className="buttons_for_cruds">
          <button onClick={() => handleEditTask(task)}>
            <img src={EditIcon} alt="Edit Pencil" />
          </button>
          <Delete taskId={task.id} onTaskDeleted={handleTaskDeleted} />
        </div>
      </div>
    );
  };

  // Column for drag-and-drop
  const Column = ({ status, children }) => {
    const [, drop] = useDrop(() => ({
      accept: "TASK",
      drop: (item) => handleDrop(item.id, status),
    }));

    return (
      <div ref={drop} className={`task_column ${status}`}>
        <h3>{status}</h3>
        {children}
      </div>
    );
  };

  return (
    <div className="center">
      <div className="task_board">
        {!isLoggedIn ? (
          <div className="auth_section">
            <h2>Welcome! Please log in or register to access your tasks.</h2>
            <div>
              <button onClick={() => setActiveForm("login")}>Login</button>
              <button onClick={() => setActiveForm("register")}>
                Register
              </button>
            </div>
            {activeForm === "login" && (
              <Login onLoginSuccess={onLoginSuccess} />
            )}
            {activeForm === "register" && <Register />}
          </div>
        ) : (
          <div>
            {showEditTask && taskToEdit && (
              <>
                <div
                  className="overlay"
                  onClick={() => setShowEditTask(false)}
                ></div>
                <UpdateTask
                  task={taskToEdit}
                  onClose={() => setShowEditTask(false)}
                  onTaskUpdated={handleUpdateTask}
                />
              </>
            )}
            <div className="task_columns">
              <Column status="Todo">
                {tasks.length === 0 ? (
                  <p>No tasks available</p>
                ) : (
                  tasks
                    .filter((task) => task.status.toLowerCase() === "todo")
                    .map((task) => <Task key={task.id} task={task} />)
                )}
              </Column>
              <Column status="In Progress">
                {tasks.length === 0 ? (
                  <p>No tasks available</p>
                ) : (
                  tasks
                    .filter((task) => task.status.toLowerCase() === "in_progress")
                    .map((task) => <Task key={task.id} task={task} />)
                )}
              </Column>
              <Column status="Done">
                {tasks.length === 0 ? (
                  <p>No tasks available</p>
                ) : (
                  tasks
                    .filter((task) => task.status.toLowerCase() === "done")
                    .map((task) => <Task key={task.id} task={task} />)
                )}
              </Column>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskBoard;
