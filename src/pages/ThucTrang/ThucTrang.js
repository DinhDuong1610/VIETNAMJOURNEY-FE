import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ThucTrang() {
  const navigate = useNavigate();
  const [iframeSrc, setIframeSrc] = useState(null);

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

  useEffect(() => {
    const checkIframeSrc = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/Merge.html`);
        if (response.ok) {
          setIframeSrc(`${process.env.PUBLIC_URL}/Merge.html`);
        } else {
          console.error('Failed to load iframe source. Please check the file path.');
        }
      } catch (error) {
        console.error('Error fetching iframe source:', error);
      }
    };

    checkIframeSrc();
  }, []);

  return (
    <div style={{ height: 'calc(100vh - 60px)', overflow: 'hidden' }}>
      {iframeSrc ? (
        <iframe
          src={iframeSrc}
          title="External Page"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          onLoad={() => console.log('Iframe loaded successfully.')}
        />
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
}
export default ThucTrang;
