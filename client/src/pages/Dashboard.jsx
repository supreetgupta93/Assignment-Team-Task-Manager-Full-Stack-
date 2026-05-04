import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  return (
    <div>
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
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Overdue Tasks</h3>
              <ul className="list-disc list-inside">
                {overdue.map(task => <li key={task._id} className="text-red-600">{task.title}</li>)}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;