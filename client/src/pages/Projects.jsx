import axios from 'axios';
import { useEffect, useState } from 'react';
import Toast from '../components/Toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [meRes, projectsRes] = await Promise.all([
          axios.get('/api/auth/me', { headers: { Authorization: token } }),
          axios.get('/api/projects', { headers: { Authorization: token } })
        ]);
        setCurrentUser(meRes.data);
        setProjects(projectsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (name.trim().length < 2) {
      newErrors.name = 'Project name must be at least 2 characters';
    }
    if (description.trim().length < 5) {
      newErrors.description = 'Description must be at least 5 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/projects', { name, description }, { headers: { Authorization: token } });
      setToast({ message: 'Project created successfully!', type: 'success' });
      setName('');
      setDescription('');
      const res = await axios.get('/api/projects', { headers: { Authorization: token } });
      setProjects(res.data);
    } catch (err) {
      const msg = err.response?.data?.msg || 'Error creating project';
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/projects/${projectId}`, { headers: { Authorization: token } });
      setToast({ message: 'Project deleted successfully!', type: 'success' });
      setProjects(projects.filter(p => p._id !== projectId));
    } catch (err) {
      const msg = err.response?.data?.msg || 'Error deleting project';
      setToast({ message: msg, type: 'error' });
    }
  };

  if (currentUser?.role !== 'Admin') {
    return (
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Projects</h2>
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 text-blue-700 mb-6">
          Only admins can create projects.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <div key={project._id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">{project.name}</h3>
              <p className="text-gray-600 text-sm mt-2">{project.description}</p>
              <p className="text-gray-500 text-xs mt-3">Created by: {project.createdBy?.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Projects</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Project Name</label>
          <input
            type="text"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            placeholder="Enter project name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            rows="3"
            placeholder="Enter project description"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition"
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => (
          <div key={project._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold">{project.name}</h3>
            <p className="text-gray-600 text-sm mt-2">{project.description}</p>
            <p className="text-gray-500 text-xs mt-3">Created by: {project.createdBy?.name}</p>
            {currentUser?._id === project.createdBy?._id && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleDelete(project._id)}
                  className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Projects;