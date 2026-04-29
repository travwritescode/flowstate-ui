import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { listTasks, deleteTask } from '../api/tasks';
import { useAuth } from '../context/AuthContext';
import TaskFilters from '../components/TaskFilters';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';

const DEFAULT_FILTERS = { status: '', priority: '' };

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formTask, setFormTask] = useState(undefined);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listTasks(filters);
      setTasks(data);
    } catch {
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function handleDelete(id) {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError('Failed to delete task. Please try again.');
    }
  }

  function handleEdit(task) {
    setFormTask(task);
  }

  function handleSave(saved) {
    setTasks((prev) => {
      const exists = prev.find((t) => t.id === saved.id);
      return exists
        ? prev.map((t) => (t.id === saved.id ? saved : t))
        : [saved, ...prev];
    });
    setFormTask(undefined);
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="tasks-page">
      <header className="tasks-header">
        <h1>My Tasks</h1>
        <div className="tasks-header__actions">
          <button type="button" className="btn-primary" onClick={() => setFormTask(null)}>
            Create Task
          </button>
          <button type="button" className="btn-link" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </header>

      <main>
        <TaskFilters filters={filters} onChange={setFilters} />

        {error && (
          <p role="alert" className="error-message">
            {error}
          </p>
        )}

        {loading ? (
          <p aria-live="polite" aria-busy="true" className="loading-state">
            Loading tasks…
          </p>
        ) : (
          <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </main>

      {formTask !== undefined && (
        <TaskForm
          task={formTask}
          onClose={() => setFormTask(undefined)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
