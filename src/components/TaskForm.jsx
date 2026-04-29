import { useState, useEffect, useRef } from 'react';
import { createTask, updateTask } from '../api/tasks';

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  due_date: '',
};

export function validateTask(fields) {
  const errors = {};
  if (!fields.title.trim()) {
    errors.title = 'Title is required.';
  } else if (fields.title.trim().length > 200) {
    errors.title = 'Title must be 200 characters or fewer.';
  }
  return errors;
}

export default function TaskForm({ task, onClose, onSave }) {
  const isEdit = !!task;
  const headingId = 'task-form-heading';

  const [fields, setFields] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const firstInputRef = useRef(null);

  useEffect(() => {
    if (task) {
      setFields({
        title: task.title ?? '',
        description: task.description ?? '',
        status: task.status ?? 'todo',
        priority: task.priority ?? 'medium',
        due_date: task.due_date ?? '',
      });
    } else {
      setFields(EMPTY_FORM);
    }
    setFieldErrors({});
    setApiError('');
  }, [task]);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  function handleChange(e) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');

    const errors = validateTask(fields);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);

    const payload = {
      title: fields.title.trim(),
      description: fields.description || null,
      status: fields.status,
      priority: fields.priority,
      due_date: fields.due_date || null,
    };

    try {
      const saved = isEdit
        ? await updateTask(task.id, payload)
        : await createTask(payload);
      onSave(saved);
    } catch {
      setApiError('Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} data-testid="modal-backdrop">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="modal"
        onClick={(e) => e.stopPropagation()}
        data-testid="task-form"
      >
        <h2 id={headingId}>{isEdit ? 'Edit Task' : 'Create Task'}</h2>

        {apiError && (
          <p role="alert" className="error-message">
            {apiError}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="task-title">Title</label>
            <input
              id="task-title"
              name="title"
              type="text"
              value={fields.title}
              onChange={handleChange}
              maxLength={200}
              aria-invalid={!!fieldErrors.title}
              aria-describedby={fieldErrors.title ? 'title-error' : undefined}
              ref={firstInputRef}
              required
            />
            {fieldErrors.title && (
              <p id="title-error" role="alert" className="field-error">
                {fieldErrors.title}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              name="description"
              value={fields.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="field">
            <label htmlFor="task-status">Status</label>
            <select
              id="task-status"
              name="status"
              value={fields.status}
              onChange={handleChange}
            >
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              name="priority"
              value={fields.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="task-due-date">Due date</label>
            <input
              id="task-due-date"
              name="due_date"
              type="date"
              value={fields.due_date}
              onChange={handleChange}
            />
          </div>

          <div className="modal__actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving…' : 'Save'}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
