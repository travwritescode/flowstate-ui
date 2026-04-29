import client from './client';

export async function listTasks(filters = {}) {
  const params = {};
  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;

  const response = await client.get('/tasks', { params });
  return response.data;
}

export async function createTask(data) {
  const response = await client.post('/tasks', data);
  return response.data;
}

export async function updateTask(id, data) {
  const response = await client.put(`/tasks/${id}`, data);
  return response.data;
}

export async function deleteTask(id) {
  await client.delete(`/tasks/${id}`);
}
