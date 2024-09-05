import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Information.module.css'; // Import the CSS module
import { Skeleton, message } from 'antd';
import API_BASE_URL from '../../../config/configapi.js'; // Import message from antd

function Information() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const thread = params.get('thread');
    const [info, setInfo] = useState(null);
    const [adminInfo, setAdminInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (thread) {
            fetch(`${API_BASE_URL}api/getInformationMeeting`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ thread })
            })
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                if (data.status === 'success') {
                    setInfo(data.data);
                    setAdminInfo(data.data.admin);
                } else if (data.status === 'soon') {
                    message.warning(data.message, 3, () => navigate('/TrangChu')); // Show warning and redirect to home
                } else if (data.status === 'late') {
                    message.error(data.message, 3, () => navigate('/TrangChu')); // Show error and redirect to home
                } else {
                    setError(data.message || 'Failed to retrieve information.');
                }
            })
            .catch(error => {
                setLoading(false);
                setError('An error occurred while fetching data.');
                console.error('Error:', error);
            });
        } else {
            setLoading(false);
            setError('Thread parameter is missing.');
        }
    }, [thread, navigate]);

    if (loading) {
        return <div>
            <Skeleton avatar paragraph={{ rows: 1 }} active />
        </div>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Thông tin cuộc họp</h2>
            {info && (
                <div className={styles['info-container']}>
                    <p className={styles['info-item']}><strong>Tên :</strong> {info.campaign.name}</p>
                    <p className={styles['info-item']}><strong>Ngày bắt đầu : </strong> {info.date}</p>
                    <p className={styles['info-item']}><strong>Tỉnh/Thành phố :</strong> {info.campaign.province}</p>
                </div>
            )}
            {adminInfo && (
                <div className={styles['info-container']}>
                    <h3 className={styles.subheading}>Quản trị viên</h3>
                    <p className={styles['info-item']}><strong>Tên :</strong> {adminInfo.name}</p>
                    <p className={styles['info-item']}><img src={`https://bwdjourney.id.vn/${adminInfo.image}`} alt={adminInfo.name} className={styles['admin-image']} /></p>
                </div>
            )}
        </div>
    );
}

export default Information;
