import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/tasks');
        
        if (res.data && Array.isArray(res.data)) {
          setTasks(res.data);
          // Filter overdue
          const now = new Date();
          setOverdue(res.data.filter(task => new Date(task.dueDate) < now && task.status !== 'Completed'));
        } else {
          setError('Invalid task data received');
          setToast({ message: 'Error loading tasks: Invalid data format', type: 'error' });
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
        const errorMsg = err.response?.data?.msg || err.message || 'Error loading tasks';
        setError(errorMsg);
        setToast({ message: errorMsg, type: 'error' });
        setTasks([]);
        setOverdue([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      setToast({ message: 'Task status updated!', type: 'success' });
      const res = await api.get('/tasks');
      setTasks(res.data);
      const now = new Date();
      setOverdue(res.data.filter(task => new Date(task.dueDate) < now && task.status !== 'Completed'));
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Error updating task';
      setToast({ message: errorMsg, type: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading dashboard...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          <strong>Error:</strong> {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-500 text-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Total Tasks</h3>
              <p className="text-2xl">{tasks.length}</p>
            </div>
            <div className="bg-green-500 text-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Completed</h3>
              <p className="text-2xl">{tasks.filter(t => t.status === 'Completed').length}</p>
            </div>
            <div className="bg-yellow-500 text-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold">In Progress</h3>
              <p className="text-2xl">{tasks.filter(t => t.status === 'In Progress').length}</p>
            </div>
            <div className="bg-red-500 text-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Overdue</h3>
              <p className="text-2xl">{overdue.length}</p>
            </div>
          </div>

          {overdue.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-4">Overdue Tasks</h3>
              <ul className="list-disc list-inside">
                {overdue.map(task => <li key={task._id} className="text-red-600">{task.title}</li>)}
              </ul>
            </div>
          )}

          <h3 className="text-2xl font-bold mb-4">Your Tasks</h3>
          {tasks.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
              No tasks assigned to you.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map(task => (
                <div key={task._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
                  <div className="mb-2">
                    <h4 className="text-lg font-semibold">{task.title}</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <select
                    className="w-full px-3 py-2 border border-blue-300 rounded text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={task.status}
                    onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;