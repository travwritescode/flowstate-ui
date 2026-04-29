function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function TaskList({ tasks, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks found. Create one to get started.</p>;
  }

  return (
    <ul className="task-list" aria-label="Tasks">
      {tasks.map((task) => (
        <li key={task.id} className="task-item" data-testid={`task-item-${task.id}`}>
          <div className="task-item__body">
            <span className="task-item__title">{task.title}</span>
            <div className="task-item__meta">
              <span className={`badge badge--status badge--${task.status}`}>
                {task.status.replace('_', ' ')}
              </span>
              <span className={`badge badge--priority badge--${task.priority}`}>
                {task.priority}
              </span>
              {task.due_date && (
                <span className="task-item__due">Due {formatDate(task.due_date)}</span>
              )}
            </div>
          </div>

          <div className="task-item__actions">
            <button
              type="button"
              className="btn-secondary"
              aria-label={`Edit ${task.title}`}
              onClick={() => onEdit(task)}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn-danger"
              aria-label={`Delete ${task.title}`}
              onClick={() => onDelete(task.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
