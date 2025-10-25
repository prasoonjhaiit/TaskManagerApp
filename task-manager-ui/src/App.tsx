import { useState, useEffect } from 'react';
import { taskApi } from './services/api';
import type { Task, FilterType } from './types';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import FilterButtons from './components/FilterButtons';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tasks when component mounts
  useEffect(() => {
    loadTasks();
  }, []);

  // Save to localStorage whenever tasks change (Enhancement)
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  /**
   * Load all tasks from API
   */
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await taskApi.getAllTasks();
      setTasks(data);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks. Make sure the backend is running on the correct port.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a new task
   */
  const handleAddTask = async (description: string) => {
    try {
      setError(null);
      
      const newTask = await taskApi.createTask({ description });
      setTasks([...tasks, newTask]);
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task. Please try again.');
    }
  };

  /**
   * Toggle task completion status
   */
  const handleToggleComplete = async (task: Task) => {
    try {
      setError(null);
      
      const updatedTask = await taskApi.updateTask(task.id, {
        description: task.description,
        isCompleted: !task.isCompleted,
      });
      
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
    }
  };

  /**
   * Update task description
   */
  const handleUpdateTask = async (id: number, description: string) => {
    try {
      setError(null);
      
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const updatedTask = await taskApi.updateTask(id, {
        description,
        isCompleted: task.isCompleted,
      });
      
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task description. Please try again.');
    }
  };

  /**
   * Delete a task
   */
  const handleDeleteTask = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      setError(null);
      
      await taskApi.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };

  /**
   * Filter tasks based on current filter
   */
  const getFilteredTasks = (): Task[] => {
    switch (filter) {
      case 'active':
        return tasks.filter(t => !t.isCompleted);
      case 'completed':
        return tasks.filter(t => t.isCompleted);
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();
  const activeCount = tasks.filter(t => !t.isCompleted).length;
  const completedCount = tasks.filter(t => t.isCompleted).length;

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>📝 Task Manager</h1>
          <p className="subtitle">Stay organized and productive</p>
        </header>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
            <button 
              onClick={() => setError(null)} 
              className="close-error"
              aria-label="Close error"
            >
              ×
            </button>
          </div>
        )}

        <AddTaskForm 
          onAdd={handleAddTask} 
          isLoading={loading}
        />

        <FilterButtons
          currentFilter={filter}
          onFilterChange={setFilter}
          counts={{
            all: tasks.length,
            active: activeCount,
            completed: completedCount,
          }}
        />

        {loading && tasks.length === 0 ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading tasks...</p>
          </div>
        ) : (
          <>
            {filteredTasks.length === 0 && tasks.length > 0 ? (
              <div className="empty-state">
                <p>No {filter} tasks</p>
              </div>
            ) : (
              <TaskList
                tasks={filteredTasks}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                onUpdate={handleUpdateTask}
              />
            )}
          </>
        )}

        <footer className="app-footer">
          <p>
            {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;