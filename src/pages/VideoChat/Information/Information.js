import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Giả sử bạn đang dùng react-router để điều hướng

function Information() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const thread = params.get('thread'); // Lấy thread từ params
    const [info, setInfo] = useState(null);
    const [adminInfo, setAdminInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (thread) {
            fetch(`http://localhost:8000/api/getInformationMeeting`, {
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
                    setAdminInfo(data.data.admin); // Cập nhật thông tin admin từ data.data.admin
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
    }, [thread]);

    if (loading) {
        return <p>Loading...</p>; // Hoặc một spinner
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h2>Thông tin cuộc họp</h2>
            {info && (
                <div>
                    <p><strong>Campaign ID:</strong> {info.campaign_id}</p>
                    <p><strong>Date:</strong> {info.date}</p>
                    <p><strong>Is Active:</strong> {info.isactive ? 'Yes' : 'No'}</p>
                    <h3>Campaign Details</h3>
                    <p><strong>Name:</strong> {info.campaign.name}</p>
                    <p><strong>Province:</strong> {info.campaign.province}</p>
                </div>
            )}
            {adminInfo && (
                <div>
                    <h3>Admin Details</h3>
                    <p><strong>Name:</strong> {adminInfo.name}</p>
                    <p><strong>Image:</strong> <img src={`http://localhost:8000/${adminInfo.image}`} alt={adminInfo.name} /></p>
                </div>
            )}
        </div>
    );
}

export default Information;
