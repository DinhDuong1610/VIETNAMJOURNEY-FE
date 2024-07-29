import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import styles from './Messenger.module.css';
import MessengerUser from './MessengerUser/MessengerUser';
import MessengerGroup from './MessengerGroup/MessengerGroup';
import ChatBoxUser from './ChatBox/ChatBoxUser';
import ChatBoxGroup from './ChatBox/ChatBoxGroup';
import { useCheckCookie } from '../../Cookie/getCookie.js';
import API_BASE_URL from '../../config/configapi.js';

function Messenger() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    const user_ID = useCheckCookie('User_ID', '/TaiKhoan');
    const [currentView, setCurrentView] = useState(type);
    const [activeTab, setActiveTab] = useState('user');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [array, setArray] = useState([]);
    const navigate = useNavigate();
    const ws = useRef(null);

    useEffect(() => {
        const fetchOnlineUsers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}api/getOnlineUser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: user_ID }),
                });
                const data = await response.json();
                setOnlineUsers(data.onlineUsers);

                // Sau khi nhận được danh sách onlineUsers từ API, gửi nó qua WebSocket
                if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                    ws.current.send(JSON.stringify({ type: 'getUserOnlines', onlineUsers: data.onlineUsers }));
                }
            } catch (error) {
                console.error('Error fetching online users:', error);
            }
        };

        fetchOnlineUsers();
        ws.current = new WebSocket('wss://bwdjourney.id.vn:8080');
        ws.current.onopen = () => {
            console.log('WebSocket connected');
            ws.current.send(JSON.stringify({ type: 'subscribe', user_online: user_ID }));
        };

        let handledOnce = false; // Biến flag để chỉ xử lý dữ liệu một lần

        ws.current.onmessage = (event) => {
            const receivedMessage = JSON.parse(event.data);
            
            if (!handledOnce && receivedMessage.type === 'getUserOnlines') {
                setArray(receivedMessage.onlineUsers);
                handledOnce = true; // Đánh dấu đã xử lý dữ liệu
            }
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            ws.current.close();
        };
    }, [user_ID]);

    useEffect(() => {
    const checkAndHandleResize = () => {
        const container1 = document.querySelector(`.${styles.container1}`);
        const container2 = document.querySelector(`.${styles.container2}`);
        if (window.innerWidth < 560) {
            container1.classList.add(styles.fullWidth);
            container1.classList.remove(styles.hidden);
            container2.classList.add(styles.hidden);
        } else {
            container1.classList.remove(styles.fullWidth);
            container1.classList.remove(styles.hidden);
            container2.classList.remove(styles.hidden);
        }
    };

    let lastWindowWidth = window.innerWidth;

    const handleResize = () => {
        const currentWindowWidth = window.innerWidth;
        if (lastWindowWidth !== currentWindowWidth) {
            checkAndHandleResize();
            lastWindowWidth = currentWindowWidth; // Cập nhật lại chiều rộng cửa sổ cuối cùng
        }
    };

    checkAndHandleResize(); // Kiểm tra ngay sau khi load trang
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);



    const handleUserClick = (type, userId) => {
        navigate(`/Messenger?type=${type}&user_id=${userId}`);
    };

    const handleViewChange = (view) => {
        setActiveTab(view);
        setCurrentView(view);
        navigate(`/Messenger?type=${view}&user_id=${user_ID}`);
    };

    const handleGroupClick = (groupId) => {
        navigate(`/Messenger?type=group&group_id=${groupId}`);
    };

    const toggleContainers = () => {
        const container1 = document.querySelector(`.${styles.container1}`);
        const container2 = document.querySelector(`.${styles.container2}`);
        if (window.innerWidth < 560) {
            container2.classList.add(styles.fullWidth);
            container2.classList.remove(styles.hidden);
            container1.classList.add(styles.hidden);
        }
    };
    
    const closeChatBox = () => {
        const container1 = document.querySelector(`.${styles.container1}`);
        const container2 = document.querySelector(`.${styles.container2}`);
        if (window.innerWidth < 560) {
            container2.classList.add(styles.hidden);
            container1.classList.add(styles.fullWidth);
            container1.classList.remove(styles.hidden);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.container1}>
                <div className={styles.container1Head}>
                    <div className={styles.title}>
                        <h6 style={{ fontWeight: 'revert', color: 'green' }}>Chats</h6>
                        <p style={{ marginTop: '0px', fontSize: '1.4rem', marginRight: '10px' }}>
                            <i className="fa-regular fa-pen-to-square"></i>
                        </p>
                    </div>
                    <input type="text" placeholder="Tìm kiếm người dùng" />
                    <div className={styles.tabs}>
                        <h5
                            onClick={() => handleViewChange('user')}
                            className={`${styles.tab} ${currentView === 'user' ? styles.active : ''}`}
                        >
                            Cá nhân
                        </h5>
                        <h5
                            onClick={() => handleViewChange('group')}
                            className={`${styles.tab} ${currentView === 'group' ? styles.active : ''}`}
                        >
                            Cộng đồng
                        </h5>
                    </div>
                </div>
                <div className={styles.chatname} style={{ padding: '0' }}>
                    {currentView === 'user' ? (
                        <MessengerUser user_ID={user_ID} onUserClick={handleUserClick} onlineUsers={array} toggleContainers={toggleContainers} />
                    ) : (
                        <MessengerGroup user_ID={user_ID} onGroupClick={handleGroupClick} toggleContainers={toggleContainers} />

                    )}
                </div>
            </div>
            <div className={styles.container2}>
                <Routes>
                    <Route path="/" element={currentView === 'user' ? <ChatBoxUser closeChatBox={closeChatBox} /> : <ChatBoxGroup closeChatBox={closeChatBox} />} />
                </Routes>
            </div>
        </div>
    );
}

export default Messenger;
