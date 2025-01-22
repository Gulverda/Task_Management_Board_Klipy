import React from "react";
import axios from "axios";
import DeleteIcon from "../../../assets/delete.svg"

const Delete = ({ taskId, onTaskDeleted }) => {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onTaskDeleted(taskId);
      alert("Task deleted successfully.");
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete the task. Please try again.");
    }
  };

  return (
    <button onClick={handleDelete} className="delete_btn">
      <img src={DeleteIcon} alt="Delete Icon" />
    </button>
  );
};

export default Delete;
