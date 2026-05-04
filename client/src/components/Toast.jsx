import { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500';
  const icon = type === 'error' ? '✕' : type === 'success' ? '✓' : 'ℹ';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-pulse z-50`}>
      <span className="font-bold text-lg">{icon}</span>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
