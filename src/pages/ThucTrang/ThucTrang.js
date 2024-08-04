// ThucTrang.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ThucTrang() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleButtonClick = (event) => {
      const target = event.detail;
      if (target === 'TrangChu') {
        navigate('/TrangChu');
      } else if (target === 'ChienDich') {
        navigate('/ChienDich');
      } else if (target === 'CongDong') {
        navigate('/CongDong');
      }
    };

    window.addEventListener('navigate', handleButtonClick);

    return () => {
      window.removeEventListener('navigate', handleButtonClick);
    };
  }, [navigate]);

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <iframe
        src="/Merge.html"
        title="External Page"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
      />
    </div>
  );
}

export default ThucTrang;
