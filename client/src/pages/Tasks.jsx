import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      try {
        const [meRes, tasksRes, projectsRes, usersRes] = await Promise.all([
          axios.get('/api/auth/me', { headers: { Authorization: token } }),
          axios.get('/api/tasks', { headers: { Authorization: token } }),
          axios.get('/api/projects', { headers: { Authorization: token } }),
          axios.get('/api/users', { headers: { Authorization: token } })
        ]);
        setCurrentUser(meRes.data);
        setTasks(tasksRes.data);
        setProjects(projectsRes.data);
        setUsers(usersRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setToast({ message: 'Error loading tasks', type: 'error' });
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (title.trim().length < 3) newErrors.title = 'Title must be at least 3 characters';
    if (description.trim().length < 5) newErrors.description = 'Description must be at least 5 characters';
    if (!dueDate) newErrors.dueDate = 'Due date is required';
    if (!projectId) newErrors.projectId = 'Project is required';
    if (!assignedTo) newErrors.assignedTo = 'Assignee is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/tasks', { title, description, dueDate, projectId, assignedTo }, { headers: { Authorization: token } });
      setToast({ message: 'Task created successfully!', type: 'success' });
      setTitle('');
      setDescription('');
      setDueDate('');
      setProjectId('');
      setAssignedTo('');
      setErrors({});
      const res = await axios.get('/api/tasks', { headers: { Authorization: token } });
      setTasks(res.data);
    } catch (err) {
      const msg = err.response?.data?.msg || 'Error creating task';
      setToast({ message: msg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`/api/tasks/${id}`, { status }, { headers: { Authorization: token } });
      setToast({ message: 'Task status updated!', type: 'success' });
      const res = await axios.get('/api/tasks', { headers: { Authorization: token } });
      setTasks(res.data);
    } catch (err) {
      const msg = err.response?.data?.msg || 'Error updating task';
      setToast({ message: msg, type: 'error' });
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/tasks/${taskId}`, { headers: { Authorization: token } });
      setToast({ message: 'Task deleted successfully!', type: 'success' });
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) {
      const msg = err.response?.data?.msg || 'Error deleting task';
      setToast({ message: msg, type: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Tasks</h2>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading tasks...</div>
      ) : currentUser?.role === 'Admin' ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">Create New Task</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Title</label>
              <input
                type="text"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={submitting}
                placeholder="Task title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Due Date</label>
              <input
                type="date"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.dueDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={submitting}
              />
              {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
              rows="3"
              placeholder="Task description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Project</label>
              <select
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.projectId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                disabled={submitting}
              >
                <option value="">Select Project</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
              {errors.projectId && <p className="text-red-500 text-sm mt-1">{errors.projectId}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Assign To</label>
              <select
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.assignedTo ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                disabled={submitting}
              >
                <option value="">Select Team Member</option>
                {users.filter(u => u.role === 'Member').map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
              {errors.assignedTo && <p className="text-red-500 text-sm mt-1">{errors.assignedTo}</p>}
            </div>
          </div>
          <button 
            type="submit" 
            disabled={submitting}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition"
          >
            {submitting ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      ) : (
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 text-blue-700 mb-6">
          Only admins can create tasks. You can update the status of tasks assigned to you.
        </div>
      )}

      <h3 className="text-2xl font-bold mb-4">Tasks List</h3>
      {tasks.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
          No tasks available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(task => (
            <div key={task._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold flex-1">{task.title}</h3>
                {currentUser?.role === 'Admin' && (
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold ml-2"
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-2">{task.description}</p>
              <p className="text-xs text-gray-500 mb-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              <p className="text-xs text-gray-500 mb-3">Assigned to: {task.assignedTo?.name}</p>
              <div className="mt-3">
                <select
                  className={`w-full px-2 py-1 border rounded text-sm ${
                    currentUser?.role === 'Member' && task.assignedTo?._id === currentUser?._id
                      ? 'border-blue-300 cursor-pointer'
                      : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                  }`}
                  value={task.status}
                  onChange={(e) => updateStatus(task._id, e.target.value)}
                  disabled={!(currentUser?.role === 'Member' && task.assignedTo?._id === currentUser?._id)}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                {!(currentUser?.role === 'Member' && task.assignedTo?._id === currentUser?._id) && (
                  <p className="text-xs text-gray-500 mt-2 italic">Only the assigned member can update status.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Tasks;