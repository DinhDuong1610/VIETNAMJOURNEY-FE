import React, { useState, useEffect, useRef } from 'react';
import { Skeleton } from 'antd';
import styles from './MessengerUser.module.css';
import API_BASE_URL from '../../../config/configapi.js';
import URL_SOCKET from '../Config/ConfigURL.js'

function MessengerUser({ user_ID, onUserClick, onlineUsers, toggleContainers }) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const ws = useRef(null);

    useEffect(() => {
        fetchUsersChat();

        ws.current = new WebSocket(`${URL_SOCKET}`);
        ws.current.onopen = () => {
            ws.current.send(JSON.stringify({ type: 'subscribe', user_from: user_ID }));
        };

        ws.current.onmessage = (event) => {
            const receivedMessage = JSON.parse(event.data);
            if (receivedMessage.type === 'sendMessage' && receivedMessage.user_to === user_ID) {
                updateUsersChat(receivedMessage);
            }
            if (receivedMessage.type === 'sendMessage' && receivedMessage.user_from === user_ID) {
                updateUsersChatFrom(receivedMessage);
            }
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            ws.current.close();
        };
    }, [user_ID]);

    const fetchUsersChat = () => {
        fetch(`${API_BASE_URL}api/getUsersChat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_from: user_ID }),
        })
            .then(response => response.json())
            .then(data => {
                setUsers(data.chats);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setLoading(false);
            });
    };

   const updateUsersChat = (receivedMessage) => {
    setUsers(prevUsers => {
        const userIndex = prevUsers.findIndex(user => user.user_to == receivedMessage.user_from);
        
        let updatedUsers;
        let updatedUser;

        // Check if user exists in the previous list
        if (userIndex !== -1) {
            // If user exists, update the existing user
            updatedUsers = [...prevUsers];
            const existingUser = updatedUsers[userIndex];

            updatedUser = {
                ...existingUser, // Keep existing user's data
                latest_content: receivedMessage.image ? 'Hình ảnh' : receivedMessage.content,
            };

            // Remove old user data
            updatedUsers.splice(userIndex, 1);
        } else {
            // If user does not exist, add a new user
            updatedUsers = prevUsers;
            updatedUser = {
                user_to: receivedMessage.user_from,
                user_image: '', // Set default image if none exists
                user_name: '',  // Set default name if none exists
                latest_content: receivedMessage.image ? 'Hình ảnh' : receivedMessage.content,
            };
        }

        // Add the updated user to the top of the list
        return [updatedUser, ...updatedUsers];
    });
};

    const updateUsersChatFrom = (receivedMessage) => {
    setUsers(prevUsers => {
        const userIndex = prevUsers.findIndex(user => user.user_to == receivedMessage.user_to);
        let updatedUsers = [...prevUsers];
        let updatedUser;

        if (userIndex !== -1) {
            // Cập nhật người dùng đã tồn tại
            const existingUser = updatedUsers[userIndex];

            updatedUser = {
                ...existingUser, // Giữ lại dữ liệu người dùng cũ
                latest_content: receivedMessage.image ? 'Hình ảnh' : receivedMessage.content,
            };

            // Loại bỏ dữ liệu người dùng cũ
            updatedUsers.splice(userIndex, 1);
        } else {
            // Thêm người dùng mới nếu không tồn tại
            updatedUser = {
                user_to: receivedMessage.user_to,
                user_image: '', // Đặt ảnh mặc định nếu không có
                user_name: '',  // Đặt tên mặc định nếu không có
                latest_content: receivedMessage.image ? 'Hình ảnh' : receivedMessage.content,
            };
        }

        // Thêm người dùng đã cập nhật vào đầu danh sách
        return [updatedUser, ...updatedUsers];
    });
};

    const handleUserClick = (type, userId) => {
        onUserClick(type, userId);
        setSelectedUser(userId);
        toggleContainers(); // Gọi hàm toggleContainers khi người dùng được chọn
    };

    const isUserOnline = (userTo) => {
        return onlineUsers.includes(userTo);
    };

    return (
        <div className={styles.container}>
            {loading ? (
                <div>
                    <Skeleton avatar paragraph={{ rows: 1 }} active />
                    <Skeleton avatar paragraph={{ rows: 1 }} active />
                    <Skeleton avatar paragraph={{ rows: 1 }} active />
                </div>
            ) : (
                users.map(user => (
                    <div
                        key={user.user_to}
                        className={`${styles.containeruser} ${selectedUser === user.user_to ? styles.selected : ''}`}
                        onClick={() => handleUserClick('user', user.user_to)}
                    >
                        <div className={styles.useravatar}>
                            <img src={user.user_image} alt="avatar" />
                            {isUserOnline(user.user_to) && <div className={styles.activeDot}></div>} {/* Green dot for user activity */}
                        </div>
                        <div className={styles.userinfo}>
                            <h6>{user.user_name}</h6>
                            <p>{user.latest_content ? user.latest_content : "Hình ảnh"}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default MessengerUser;
