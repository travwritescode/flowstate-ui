const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
];

const PRIORITY_OPTIONS = [
  { value: '', label: 'All priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export default function TaskFilters({ filters, onChange }) {
  function handleChange(e) {
    onChange({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <div className="task-filters" role="search" aria-label="Filter tasks">
      <div className="field field--inline">
        <label htmlFor="filter-status">Status</label>
        <select
          id="filter-status"
          name="status"
          value={filters.status}
          onChange={handleChange}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field field--inline">
        <label htmlFor="filter-priority">Priority</label>
        <select
          id="filter-priority"
          name="priority"
          value={filters.priority}
          onChange={handleChange}
        >
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
