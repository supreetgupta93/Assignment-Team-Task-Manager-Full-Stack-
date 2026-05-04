import { Link, useNavigate } from 'react-router-dom';

const Nav = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!token) return null;

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <div className="flex space-x-4">
          <Link to="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">Dashboard</Link>
          <Link to="/projects" className="hover:bg-blue-700 px-3 py-2 rounded">Projects</Link>
          <Link to="/tasks" className="hover:bg-blue-700 px-3 py-2 rounded">Tasks</Link>
        </div>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 px-3 py-2 rounded">Logout</button>
      </div>
    </nav>
  );
};

export default Nav;