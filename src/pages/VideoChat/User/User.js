import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import anh from '../../../Images/User/anhchiendich.png';
import styles from './User.module.css';
import { Skeleton , message } from 'antd';
import { useCheckCookie } from '../../../Cookie/getCookie.js';
import API_BASE_URL from '../../../config/configapi.js';

function User() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const thread = params.get('thread');
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState([]);
    const [adminInfo, setAdminInfo] = useState(null);
    const [error, setError] = useState(null);
    const [exitingUsers, setExitingUsers] = useState([]); 
    const group_id = params.get('group_id');
    const user_id = useCheckCookie('User_ID', '/TaiKhoan');
    const navigate = useNavigate();
    const ws = useRef(null);

    useEffect(() => {
    if (group_id && user_id) {
        fetch(`${API_BASE_URL}api/checkMemberMeeting`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ campaign_id: group_id, user_id: user_id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'yes') {
                setUserInfo([{ userId: user_id, name: data.name, image: data.image }]);

                // Kết nối đến WebSocket
                ws.current = new WebSocket(`wss://socket.bwdjourney.id.vn:8080`);

                // Xử lý khi kết nối mở
                ws.current.onopen = () => {
                    if (ws.current.readyState === WebSocket.OPEN) {
                        ws.current.send(JSON.stringify({
                            type: 'subscribe',
                            thread_meeting: thread,
                            thread_user: user_id,
                            userInfo: { userId: user_id, name: data.name, image: data.image }
                        }));
                    }
                };

                   ws.current.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === 'userListUpdate' && Array.isArray(message.users)) {
        setUserInfo(prevInfo => {
            const updatedInfo = [...prevInfo];

            // Lọc bỏ userID đã tồn tại
            message.users.forEach(newUser => {
                const userExists = prevInfo.some(user => user.userId === newUser.userId);
                if (!userExists) {
                    updatedInfo.push(newUser);
                }
            });

            // Xử lý user rời khỏi
            const currentUserIds = prevInfo.map(user => user.userId);
            const newUserIds = message.users.map(user => user.userId);

            const usersToExit = prevInfo.filter(user => !newUserIds.includes(user.userId));
            usersToExit.forEach(user => {
                setExitingUsers(prevExiting => [...prevExiting, user.userId]);
                setTimeout(() => {
                    setUserInfo(prevState => prevState.filter(u => u.userId !== user.userId));
                    setExitingUsers(prevExiting => prevExiting.filter(id => id !== user.userId));
                }, 500);
            });

            return updatedInfo;
        });
    }
};

                    ws.current.onerror = (error) => {
                        console.error('WebSocket error:', error);
                    };

                    ws.current.onclose = () => {
                        console.log('WebSocket connection closed');
                    };
                } else {
                    navigate(`/GroupCampaign?group_id=${group_id}`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }, [group_id, user_id, thread, navigate]);

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
                setAdminInfo(data.data.admin);
            } else if (data.status === 'soon') {
                message.warning(data.message, 3, () => navigate('/Messenger?type=user&user_id=0')); 
            } else if (data.status === 'late') {
                message.error(data.message, 3, () => navigate('/Messenger?type=user&user_id=0')); 
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
}, [exitingUsers]);

    return (
        <div className={styles.container}>
            {loading ? (
                <>
                    <Skeleton avatar paragraph={{ rows: 1 }} active />
                    <Skeleton avatar paragraph={{ rows: 1 }} active />
                    <Skeleton avatar paragraph={{ rows: 1 }} active />
                </>
            ) : adminInfo ? (
                <>
                    {userInfo.map((user, index) => (
                        <div 
                            key={index} 
                            className={`${styles.userInfo} ${exitingUsers.includes(user.userId) ? styles.exit : ''}`}
                        >
                            <img alt="avatar" src={user.image || anh} className={styles.avatar} />
                            <div className={styles.details}>
                                <p style={{ fontWeight: 600 }}>{user.name} {user.userId === adminInfo.userId.toString() && <i className="fa-solid fa-user-tie" style={{ color: 'green', fontSize: '0.8rem', textAlign: 'center' }}></i> }</p>
                                <span style={{ lineHeight: '0px', fontWeight: 500 }}>{user.userId === adminInfo.userId.toString() ? 'Quản trị viên' : 'Thành viên'}</span>
                            </div>
                            <div className={styles.iconContainer}>
                                <i className="fa-solid fa-microphone"></i>
                                <i className={`fa-solid fa-ellipsis-vertical ${styles.icon}`}></i>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <p>{error || "No admin information available."}</p>
            )}
        </div>
    );
}

export default User;
