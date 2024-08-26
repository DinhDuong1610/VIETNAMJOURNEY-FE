import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Giả sử bạn đang dùng react-router để điều hướng
import anh from '../../../Images/User/anhchiendich.png';
import styles from './User.module.css';

function User() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const thread = params.get('thread'); // Lấy thread từ params
    const [adminUsers, setAdminUsers] = useState([]);
    const [regularUsers, setRegularUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true); // Bắt đầu fetch dữ liệu, set loading là true
        if (thread) {
            fetch(`http://localhost:8000/api/getMemberMeeting`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ thread }) 
            })
            .then(response => response.json())
            .then(data => {
                setLoading(false); // Kết thúc fetch dữ liệu, set loading là false
                if (data.status === "success") {
                    const fetchedAdminUsers = data.admin || []; // Lấy dữ liệu admin
                    const fetchedRegularUsers = data.data || []; // Lấy dữ liệu user thường
                    setAdminUsers(fetchedAdminUsers); // Đưa admin lên đầu
                    setRegularUsers(fetchedRegularUsers); // Đưa user thường xuống dưới
                } else {
                    setAdminUsers([]); // Đảm bảo rằng adminUsers luôn là mảng
                    setRegularUsers([]); // Đảm bảo rằng regularUsers luôn là mảng
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false); // Kết thúc fetch dữ liệu, set loading là false
                setAdminUsers([]); // Đảm bảo rằng adminUsers luôn là mảng khi có lỗi
                setRegularUsers([]); // Đảm bảo rằng regularUsers luôn là mảng khi có lỗi
            });
        }
    }, [thread]);

    return (
        <div className={styles.container}>
            {loading ? (
                <p>Loading...</p> // Hoặc một spinner
            ) : (
                <>
                    {adminUsers.length > 0 && adminUsers.map((user, index) => (
                        <div key={`admin-${index}`} className={styles.userInfo}>
                            <img alt="avatar" src={user.Image || anh} className={styles.avatar} />
                            <div className={styles.details}>
                                <p style={{ fontWeight: 600 }}>
                                    {user.Name} <i className="fa-solid fa-user-tie" style={{ color: 'green',fontSize : '0.7rem' }}></i>
                                </p>
                                <span style={{ lineHeight : '0px',fontWeight : 500 }}>Quản trị viên</span>
                            </div>
                            <div className={styles.iconContainer}>
                                <i className="fa-solid fa-microphone"></i>
                                <i className={`fa-solid fa-ellipsis-vertical ${styles.icon}`}></i>
                            </div>
                        </div>
                    ))}
                    
                    {regularUsers.length > 0 && regularUsers.map((user, index) => (
                        <div key={`user-${index}`} className={styles.userInfo}>
                            <img alt="avatar" src={user.Image || anh} className={styles.avatar} />
                            <div className={styles.details}>
                                <p style={{ fontWeight: 600 }}>
                                    {user.Name}
                                </p>
                                <span>Tham gia lúc {user.date_join}</span>
                            </div>
                            <div className={styles.iconContainer}>
                                <i className="fa-solid fa-microphone"></i>
                                <i className={`fa-solid fa-ellipsis-vertical ${styles.icon}`}></i>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

export default User;
