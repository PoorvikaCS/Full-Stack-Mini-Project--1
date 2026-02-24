import React, { useState, useEffect } from "react";
import "./App.css";

const initialForm = {
  id: null,
  title: "",
  description: "",
  priority: "Low",
  status: "To Do",
  dueDate: ""
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editing, setEditing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.dueDate) return;

    if (editing) {
      setTasks(tasks.map(task =>
        task.id === formData.id ? formData : task
      ));
      setEditing(false);
    } else {
      setTasks([...tasks, { ...formData, id: Date.now() }]);
    }

    setFormData(initialForm);
  };

  const handleEdit = (task) => {
    setFormData(task);
    setEditing(true);
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks
    .filter(task =>
      filterStatus === "All" ? true : task.status === filterStatus
    )
    .filter(task =>
      filterPriority === "All" ? true : task.priority === filterPriority
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.dueDate) - new Date(b.dueDate)
        : new Date(b.dueDate) - new Date(a.dueDate)
    );

  const completedCount = tasks.filter(t => t.status === "Completed").length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="container">
      <h1>Smart Task Dashboard</h1>

      {/* Summary */}
      <div className="summary">
        <div>Total: {tasks.length}</div>
        <div>Completed: {completedCount}</div>
        <div>Pending: {pendingCount}</div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option>To Do</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editing ? "Update Task" : "Add Task"}
        </button>
      </form>

      {/* Filters */}
      <div className="filters">
        <select onChange={(e) => setFilterStatus(e.target.value)}>
          <option>All</option>
          <option>To Do</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <select onChange={(e) => setFilterPriority(e.target.value)}>
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Due Date ↑</option>
          <option value="desc">Due Date ↓</option>
        </select>
      </div>

      {/* Task List */}
      <div className="task-list">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            className={`task-card ${task.status.replace(" ", "")}`}
          >
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <p><strong>Due:</strong> {task.dueDate}</p>
            <div className="buttons">
              <button onClick={() => handleEdit(task)}>Edit</button>
              <button onClick={() => handleDelete(task.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
