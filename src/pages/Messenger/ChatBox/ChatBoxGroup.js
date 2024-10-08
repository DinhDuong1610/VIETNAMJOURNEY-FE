import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Skeleton } from 'antd';
import styles from './ChatBoxGroup.module.css';
import dots from '../../../Images/User/dots.png';
import logo from '../../../Images/Message/formessage.png';
import API_BASE_URL from '../../../config/configapi.js';
import URL_SOCKET from '../Config/ConfigURL.js'
import Meeting from '../Meeting/Meeting.js';

function ChatBoxGroup({ closeChatBox }) {
    const cookies = document.cookie;
    const cookiesArray = cookies.split('; ');
    const userIdCookie = cookiesArray.find(cookie => cookie.startsWith('User_ID='));
    const user_from = userIdCookie ? userIdCookie.split('=')[1] : null;

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const group_id = params.get('group_id');

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isMember, setIsMember] = useState(true);
    const [groupInfo, setGroupInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [showMeeting, setShowMeeting] = useState(false);// Thêm trạng thái loading
    const contentRef = useRef(null);
    const meetingRef = useRef(null);
    const ws = useRef(null);

    const handleMeetingCreated = (meetingLink) => {
        sendLink(meetingLink);
    };

    useEffect(() => {
        setIsMember(true); 
        setMessages([]);  
        setGroupInfo({});  
        setLoading(true); 

        const fetchGroupChats = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}api/getGroupChats`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ group_id: group_id, user_id: user_from })
                });

                const data = await response.json();
                if (data.status === 'not_member') {
                    setIsMember(false);
                } else {
                    setMessages(data.chats);
                    setGroupInfo(data.groupInfo);
                }
                setLoading(false); 
            } catch (error) {
                console.error('Error fetching group chats:', error);
                setLoading(false); 
            }
        };

        ws.current = new WebSocket(`${URL_SOCKET}`);
        ws.current.onopen = () => {
            ws.current.send(JSON.stringify({
                type: 'subscribe',
                user_group_from: user_from,
                group_id: group_id
            }));
        };

        ws.current.onmessage = (event) => {
            const parsedMessage = JSON.parse(event.data);
            if (parsedMessage.type === 'chatgroup') {
                setMessages((prevMessages) => [...prevMessages, parsedMessage.chat]);
            }
        };

        fetchGroupChats();

        return () => {
            ws.current.close();
        };
    }, [group_id, user_from]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    

    const sendLink = async (meetingLink) => {

    const formData = new FormData();
    formData.append('user_id', user_from);
    formData.append('group_id', group_id);
    formData.append('message', meetingLink);
    if (selectedImage) {
        formData.append('image', selectedImage);
    }

    try {
        const response = await fetch(`${API_BASE_URL}api/sendMessageGroup`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        setMessage('');
        setSelectedImage(null);

        ws.current.send(JSON.stringify({
            type: 'chatgroup',
            chat: data.chat,
            userIds: data.userIds,
            group_id: data.group_id
        }));
    } catch (error) {
        console.error('Error sending message:', error);
    }
};





    const handleSendMessage = async (meetingLink) => {
        if (!message && !selectedImage) return;

        const formData = new FormData();
        formData.append('user_id', user_from);
        formData.append('group_id', group_id);
        formData.append('message', message);
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        try {
            const response = await fetch(`${API_BASE_URL}api/sendMessageGroup`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            setMessage('');
            setSelectedImage(null);

            ws.current.send(JSON.stringify({
                type: 'chatgroup',
                chat: data.chat,
                userIds: data.userIds,
                group_id: data.group_id
            }));
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const scrollToBottom = () => {
        if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    };
    const handleGoBack = () => {
        closeChatBox();
        console.log("back")
    };
    const toggleMeeting = () => {
        setShowMeeting(!showMeeting); // Toggle the visibility of the Meeting component
    };
    const handleOverlayClick = (e) => {
        // If the click is outside the Meeting component, close the Meeting
        if (meetingRef.current && !meetingRef.current.contains(e.target)) {
            setShowMeeting(false);
        }
    };
    return (
        <div className={styles.container}>
            {loading ? (
                <div>
                    <Skeleton  paragraph={{ rows: 2 }} active />
                    <Skeleton  paragraph={{ rows: 4 }} active />
                    <Skeleton  paragraph={{ rows: 2 }} active />
                </div>
            ) : (
                <>
                    {isMember && 
                    <div className={styles.containerHeader}>
                        <i onClick={handleGoBack} class="fa-solid fa-arrow-left"></i>
                        <img src={groupInfo.image} alt="Avatar"></img>
                        <div className={styles.containerHeaderInfo}>
                            <h5>{groupInfo.name}</h5>
                            <p>{groupInfo.province}</p>
                        </div>
                                <div className={styles.containerHeaderSettings}>
                                    {groupInfo.userId == user_from &&  <i style={{ display: 'block' }} className="fa-solid fa-video fa-beat-fade" onClick={toggleMeeting}></i> }
                            <img src={dots} alt="Settings"></img>
                        </div>
                    </div> }
                    <div className={styles.content} ref={contentRef}>
                        {!isMember ? (
                            <div>
                                <p style={{ textAlign: 'center', fontSize: '1.5rem', marginTop: '4rem' }}>Chào mừng đến với trang trò chuyện của <span style={{ fontWeight: 'bold', color: 'green' }}>Vietnam Journey</span></p>
                                <p style={{ textAlign: 'center', fontSize: '1.2rem', marginTop: '0rem' }}>Chọn một nhóm để bắt đầu ...</p>
                                <img src={logo} alt="Logo" style={{ width: '50%', marginTop: '2rem', textAlign: 'center', marginLeft: '25%', marginRight: '25%' }} />
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, index) => (
                                    <div key={index} className={styles.message}>
                                        {msg.created_at && <h6 style={{ textAlign: 'center', fontSize: '1rem', color: '#888' }}>{msg.created_at}</h6>}
                                        <div style={{marginBottom :'0.2rem'}}>
                                            <img alt="logo" src={msg.user_image} style={{ display: msg.user_from == user_from ? 'none' : 'block',width : '2rem',height : "2rem", borderRadius : '50%'}}></img>
                                        </div>
                                        {msg.content && <div className={msg.user_from == user_from ? styles.contentRight : styles.contentLeft}>
                                            <span style={{ display: msg.user_from == user_from ? 'none' : 'block',fontWeight :600,fontSize : '1rem' }}>{msg.user_name}</span>
                                            <h5>{msg.content}</h5>
                                        </div>}
                                        {msg.image && <img src={msg.image} alt="Sent" style={{ marginLeft: msg.user_from == user_from ? 'auto' : '0' }} />}
                                        
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </>
            )}
            {isMember && !loading &&
            <div className={styles.footer}>
                <div className={styles.footerinput}>
                    <div className={styles.inputWrapper}>
                        <textarea
                            placeholder="Nhập tin nhắn..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="imageInput"
                        />
                        <label htmlFor="imageInput" style={{ cursor: 'pointer', marginTop: '0' }}>
                            <i className="fa-solid fa-image"></i>
                        </label>
                    </div>
                    <button onClick={handleSendMessage}>Gửi</button>
                </div>
                {selectedImage && (
                    <div className={styles.selectedImagePreview}>
                        <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
                    </div>
                )}
                </div>}
            
            {showMeeting &&
                <div className={styles.meetingOverlay} onClick={handleOverlayClick}>
                    <div ref={meetingRef} className={styles.meetingContainer}>
                        <Meeting onMeetingCreated={handleMeetingCreated} />
                    </div>
                </div>
            }
        </div>
    );
}

export default ChatBoxGroup;