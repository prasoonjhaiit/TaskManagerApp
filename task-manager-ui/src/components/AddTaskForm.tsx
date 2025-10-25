import { useState } from 'react';

interface AddTaskFormProps {
  onAdd: (description: string) => void;
  isLoading?: boolean;
}

const AddTaskForm = ({ onAdd, isLoading = false }: AddTaskFormProps) => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedDescription = description.trim();
    
    if (!trimmedDescription) {
      alert('Please enter a task description');
      return;
    }

    onAdd(trimmedDescription);
    setDescription(''); // Clear input after adding
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What needs to be done?"
        className="task-input"
        disabled={isLoading}
        maxLength={200}
      />
      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={isLoading}
      >
        {isLoading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
};

export default AddTaskForm;