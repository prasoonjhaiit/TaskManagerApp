import type { FilterType } from '../types';

interface FilterButtonsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

const FilterButtons = ({ currentFilter, onFilterChange, counts }: FilterButtonsProps) => {
  return (
    <div className="filter-buttons">
      <button
        className={`btn-filter ${currentFilter === 'all' ? 'active' : ''}`}
        onClick={() => onFilterChange('all')}
      >
        All ({counts.all})
      </button>
      <button
        className={`btn-filter ${currentFilter === 'active' ? 'active' : ''}`}
        onClick={() => onFilterChange('active')}
      >
        Active ({counts.active})
      </button>
      <button
        className={`btn-filter ${currentFilter === 'completed' ? 'active' : ''}`}
        onClick={() => onFilterChange('completed')}
      >
        Completed ({counts.completed})
      </button>
    </div>
  );
};

export default FilterButtons;