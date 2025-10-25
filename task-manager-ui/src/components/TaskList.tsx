import { useState } from 'react';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, description: string) => void;
}

const TaskList = ({ tasks, onToggleComplete, onDelete, onUpdate }: TaskListProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks yet. Add one above!</p>
      </div>
    );
  }

  const handleStartEdit = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.description);
  };

  const handleSaveEdit = (id: number) => {
    if (editText.trim()) {
      onUpdate(id, editText.trim());
      setEditingId(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li 
          key={task.id} 
          className={`task-item ${task.isCompleted ? 'completed' : ''}`}
        >
          <div className="task-content">
            {/* Toggle Switch */}
            <div 
              className={`toggle-switch ${task.isCompleted ? 'active' : ''}`}
              onClick={() => onToggleComplete(task)}
              role="switch"
              aria-checked={task.isCompleted}
              tabIndex={0}
              title={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            >
              <div className="toggle-slider"></div>
            </div>

            {/* Task Text Section */}
            <div className="task-text-section">
              {editingId === task.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="edit-input"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveEdit(task.id);
                    } else if (e.key === 'Escape') {
                      handleCancelEdit();
                    }
                  }}
                />
              ) : (
                <span 
                  className={`task-description ${task.isCompleted ? 'completed' : ''} ${editingId === task.id ? 'editing' : ''}`}
                >
                  {task.description}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="task-actions">
            {editingId === task.id ? (
              <>
                <button
                  onClick={() => handleSaveEdit(task.id)}
                  className="btn-icon btn-save"
                  aria-label="Save changes"
                  title="Save"
                >
                  ✓
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="btn-icon btn-cancel"
                  aria-label="Cancel editing"
                  title="Cancel"
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleStartEdit(task)}
                  className="btn-icon btn-edit"
                  aria-label="Edit task"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="btn-icon btn-delete"
                  aria-label="Delete task"
                  title="Delete"
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;