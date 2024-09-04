import React, { useState, useEffect } from 'react';
import styles from './Meeting.module.css';
import { useNavigate,useLocation } from 'react-router-dom';
import { useCheckCookie } from '../../../Cookie/getCookie.js';
import API_BASE_URL from '../../../config/configapi.js';  
import { Button, message,Spin } from 'antd';



function MeetingNow({ onMeetingCreated }) {
    const [meetingData, setMeetingData] = useState(null);
    const [loading, setLoading] = useState(false); // Không còn mặc định là true
    const [error, setError] = useState(null);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const group_id = params.get('group_id');
    const navigate = useNavigate();

    const createMeeting = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}api/CreateMeeting`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ campaign_id: group_id })
            });

            const data = await response.json();
            if (response.ok) {
                setMeetingData(data);
                onMeetingCreated(`Nhóm đang có 1 cuộc họp diễn ra ngay bây giờ.
                Link tham gia : https://dinhduong1610.github.io/VIETNAMJOURNEY-FE/#/VideoChat?group_id=${group_id}&thread=${data.id}`);
            } else {
                setError(data.error || 'Failed to create meeting');
            }
        } catch (err) {
            setError('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const handleNavigate = () => {
        if (meetingData) {
            navigate(`/VideoChat?group_id=${group_id}&thread=${meetingData.id}`);
        } else {
            message.error('No meeting data available');
        }
    };

    return (
        <div className={styles.subContainer}>
            {loading ? (
                <div className={styles.spinnerContainer}>
                    <Spin size="large" />
                </div>
                
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <>
                    <h3>Cuộc họp sẽ được tạo ngay bây giờ, tiếp tục?</h3>
                    {!meetingData ? (
                        <Button type="primary" onClick={createMeeting}>Tạo cuộc họp</Button>
                    ) : (
                        <>
                            <p>Thời gian bắt đầu: {meetingData.date}</p>
                            <Button type="primary" onClick={handleNavigate}>Vào cuộc họp</Button>
                        </>
                    )}
                </>
            )}
        </div>
    );
}


function ScheduleMeeting({ onMeetingCreated }) { // Nhận callback
    const [selectedDateTime, setSelectedDateTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [meetingData, setMeetingData] = useState(null);
    const [scheduleSuccessful, setScheduleSuccessful] = useState(false);
    const user_id = useCheckCookie('User_ID', '/TaiKhoan');

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const group_id = params.get('group_id');
    const navigate = useNavigate();

    const handleDateTimeChange = (event) => {
        setSelectedDateTime(event.target.value);
    };

    const handleSchedule = async () => {
        if (!selectedDateTime) {
            message.error('Please select a date and time.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}api/scheduleMeeting`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user_id}`, 
                },
                body: JSON.stringify({ date: selectedDateTime, campaign_id: group_id })
            });

            const data = await response.json();
            if (response.ok) {
                setMeetingData(data);
                setScheduleSuccessful(true);
                onMeetingCreated(`Nhóm sẽ có 1 cuộc họp diễn ra vào lúc : ${data.date}.
                Link tham gia : https://dinhduong1610.github.io/VIETNAMJOURNEY-FE/#/VideoChat?group_id=${group_id}&thread=${data.id}`);
                message.success('Meeting scheduled successfully');
            } else {
                message.error(data.error || 'Failed to schedule meeting');
            }
        } catch (err) {
            message.error('Error scheduling meeting');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.subContainer}>
            {!scheduleSuccessful ? (
                <>
                <h3>Lên lịch cuộc họp trong tương lai.</h3>
            <p>Chọn thời gian bạn muốn lên lịch.</p>
                    <input
                        type="datetime-local"
                        className={styles.datetimeInput}
                        value={selectedDateTime}
                        onChange={handleDateTimeChange}
                    />
                    <Button
                        className={styles.scheduleButton}
                        onClick={handleSchedule}
                        disabled={loading}
                    >
                        {loading ? 'Lên lịch...' : 'Lên lịch'}
                    </Button>
                </>
            ) : (
                <div className={styles.meetingInfo}>
                    <h4>Cuộc họp đã được lên lịch</h4>
                    <p>Link cuộc họp: <a href={`https://dinhduong1610.github.io/VIETNAMJOURNEY-FE/#/VideoChat?group_id=${group_id}&thread=${meetingData.id}`}>{`https://dinhduong1610.github.io/VIETNAMJOURNEY-FE/#/VideoChat?group_id=${group_id}&thread=${meetingData.id}`}</a></p>
                    <p><strong>Thời gian:</strong> {new Date(meetingData.date).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
}


function Meeting({ onMeetingCreated }) { // Nhận callback
    const [selectedOption, setSelectedOption] = useState(null);

    const handleMeetingNow = () => {
        setSelectedOption('now');
    };

    const handleScheduleMeeting = () => {
        setSelectedOption('schedule');
    };

    return (
        <div className={styles.meetingContainer}>
            {!selectedOption ? (
                <>
                    <h2>Bạn muốn tạo cuộc họp vào khi nào?</h2>
                    <button className={styles.meetingButton} onClick={handleMeetingNow}>
                    <i class="fa-solid fa-plus fa-beat-fade"></i> Bắt đầu cuộc họp tức thì
                    </button>
                    <button className={styles.meetingButton} onClick={handleScheduleMeeting}>
                    <i class="fa-regular fa-calendar"></i> Tạo cuộc họp trong tương lai
                    </button>
                </>
            ) : selectedOption === 'now' ? (
                <MeetingNow onMeetingCreated={onMeetingCreated} />
            ) : (
                <ScheduleMeeting onMeetingCreated={onMeetingCreated} />
            )}
        </div>
    );
}

export default Meeting;