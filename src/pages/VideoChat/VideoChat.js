import React, { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { useLocation,useNavigate } from 'react-router-dom';
import styles from './VideoChat.module.css';
import User from './User/User.js';
import Information from './Information/Information.js';
import ChatBoxGroup from '../Messenger/ChatBox/ChatBoxGroup';
import { useCheckCookie } from '../../Cookie/getCookie.js';
import VideoScreen from './Client/VideoScreen.js';
import VideoCall from './Client/VideoCall.js';
import Audio from './Client/Audio.js';
import { Skeleton, message } from 'antd';

const VideoChat = () => {
    const [isDivVisible, setIsDivVisible] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [currentView, setCurrentView] = useState('user');
    const [underlinePosition, setUnderlinePosition] = useState('0%');
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const screenShareRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const mediaRecorderRef = useRef(null);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const group_id = params.get('group_id');
    const thread = params.get('thread');
    const user_id = useCheckCookie('User_ID', '/TaiKhoan');
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket(`ws://localhost:8080`);
        ws.current.onopen = () => {
            ws.current.send(JSON.stringify({ type: 'subscribe', thread: thread }));
        };

        ws.current.onmessage = (event) => {
            const receivedMessage = JSON.parse(event.data);
            if (receivedMessage.type === 'screenShare') {
                const videoBlob = receivedMessage.videoBlob;
                // Xử lý videoBlob nhận được ở đây
            }
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            ws.current.close();
        };
    }, [thread]);

    useEffect(() => {
        fetch(`http://localhost:8000/api/getInformationMeeting`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ thread })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                const adminId = data.data.admin.userId;
                setIsAdmin(adminId === parseInt(user_id));
            } else if (data.status === 'soon') {
                    message.warning("Opps, Cuộc họp chưa bắt đầu !", 3, () => navigate('/TrangChu')); // Show warning and redirect to home
                } else if (data.status === 'late') {
                    message.error("Cuộc họp đã kết thúc !", 3, () => navigate('/TrangChu')); // Show error and redirect to home
                }
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching meeting information:', error);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (isVideoOn) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }
                    peerConnectionRef.current = createPeerConnection();
                    stream.getTracks().forEach(track => peerConnectionRef.current.addTrack(track, stream));
                })
                .catch(error => console.log(error));
        } else {
            if (localVideoRef.current && localVideoRef.current.srcObject) {
                const tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
                localVideoRef.current.srcObject = null;
            }
        }

        return () => {
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
        };
    }, [isVideoOn]);

    const createPeerConnection = () => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        pc.ontrack = handleTrackEvent;
        return pc;
    };

    const handleTrackEvent = (event) => {
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
        }
    };


    const shareScreen = async () => {
    if (!isScreenSharing) {
        try {
            console.log('Bắt đầu chia sẻ màn hình...');

            // Kiểm tra và khởi tạo peerConnection nếu cần thiết
            if (!peerConnectionRef.current || peerConnectionRef.current.signalingState === 'closed') {
                peerConnectionRef.current = createPeerConnection();
            }

            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            if (screenShareRef.current) {
                screenShareRef.current.srcObject = screenStream;
            }
            setIsScreenSharing(true);

            screenStream.getTracks().forEach((track) => {
                if (peerConnectionRef.current && peerConnectionRef.current.signalingState !== 'closed') {
                    peerConnectionRef.current.addTrack(track, screenStream);
                } else {
                    console.error('peerConnectionRef.current chưa được khởi tạo hoặc đã đóng.');
                }
                track.onended = () => {
                    console.log('Chia sẻ màn hình đã dừng.');
                    setIsScreenSharing(false);
                };
            });

            // Sử dụng MediaRecorder để ghi dữ liệu video
            const mediaRecorder = new MediaRecorder(screenStream, { mimeType: 'video/webm' });
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    if (ws.current.readyState === WebSocket.OPEN) {
                        ws.current.send(event.data);
                    } else {
                        console.error('WebSocket không mở khi gửi dữ liệu.');
                    }
                }
            };
            mediaRecorder.start(10000);

            if (ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(
                    JSON.stringify({ type: 'screenShareStart', thread })
                );
            } else {
                console.error('WebSocket không mở khi gửi thông báo chia sẻ màn hình bắt đầu.');
            }

            screenStream.getVideoTracks()[0].onended = () => {
                console.log('Chia sẻ màn hình đã dừng.');
                setIsScreenSharing(false);
                if (ws.current.readyState === WebSocket.OPEN) {
                    ws.current.send(
                        JSON.stringify({ type: 'screenShareStop', thread })
                    );
                }
                mediaRecorder.stop();
            };

        } catch (error) {
            console.log('Lỗi khi chia sẻ màn hình:', error);
        }
    } else {
        console.log('Dừng chia sẻ màn hình...');
        
        if (screenShareRef.current && screenShareRef.current.srcObject) {
            const tracks = screenShareRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
            screenShareRef.current.srcObject = null;
            setIsScreenSharing(false);

            if (ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(
                    JSON.stringify({ type: 'screenShareStop', thread })
                );
            }
        }
    }
};
    const toggleDivVisibility = () => {
        setIsDivVisible(!isDivVisible);
    };

    const toggleVideo = () => {
        setIsVideoOn((prevState) => !prevState);
    };

    const toggleMic = () => {
        setIsMicOn((prevState) => !prevState);
        if (localVideoRef.current && localVideoRef.current.srcObject) {
            const audioTracks = localVideoRef.current.srcObject.getAudioTracks();
            audioTracks.forEach((track) => {
                track.enabled = !track.enabled;
            });
        }
    };

    const handleTabClick = (view, leftPosition) => {
        setCurrentView(view);
        setUnderlinePosition(leftPosition);
    };

    const endMeeting = async () => {
    if (isAdmin) {
        // Close the peer connection if it exists
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }

        // Stop local video tracks
        if (localVideoRef.current && localVideoRef.current.srcObject) {
            localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }

        // Stop screen sharing tracks
        if (screenShareRef.current && screenShareRef.current.srcObject) {
            screenShareRef.current.srcObject.getTracks().forEach(track => track.stop());
        }

        // Send 'endMeeting' message via WebSocket
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'endMeeting', thread }));
            ws.current.close();
        }

        // Make API call to closeMeeting
        try {
            await fetch('/api/closeMeeting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ thread }),
            });
        } catch (error) {
            console.error('Failed to close the meeting:', error);
        }

        // Navigate back to the home page
        navigate('/Messenger?type=user&user_id=0');
    } else {
        // Send 'endMeeting' message via WebSocket for non-admins
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'endMeeting', thread }));
            ws.current.close();
        }

        // Navigate back to the home page
        navigate('/Messenger?type=user&user_id=0');
    }
};

    return (
        <div className={styles.container}>
            <div className={styles.flexContainer}>
                <div className={`${styles.videoContainer} ${isDivVisible ? styles.shrinked : ''}`}>
    {isAdmin ? (
        <video 
            className={styles.videoElement} 
            ref={screenShareRef} 
            autoPlay 
            playsInline 
            style={{ backgroundColor: isScreenSharing ? 'transparent' : '' }}
        />
    ) : (
        <>
            {!isAdmin && <VideoScreen />}
            {!isAdmin && <VideoCall />}
        </>
    )}
</div>

<div className={`${styles.chatBox} ${isDivVisible ? styles.visible : ''}`}>
    <div style={{ display: 'flex' }}>
        <h4 style={{ marginLeft: '17px' }}>Đang trong cuộc họp</h4>
        <i 
            style={{ marginLeft: 'auto', marginRight: '0.8rem', fontSize: '1.2rem', marginBottom: 'auto', marginTop: '0.3rem' }} 
            className="fa-solid fa-x"
            onClick={toggleDivVisibility}
        ></i>
    </div>
    <div className={styles.options}>
        <span 
            id="member-tab" 
            className={`${styles.tab} ${currentView === 'user' ? styles.activeTab : ''}`}
            onClick={() => handleTabClick('user', '0%')}
        >
            Đang tham gia
        </span>
        <span 
            id="chat-tab" 
            className={`${styles.tab} ${currentView === 'chat' ? styles.activeTab : ''}`}
            onClick={() => handleTabClick('chat', '33%')}
        >
            Đoạn chat
        </span>
        <span 
            id="info-tab" 
            className={`${styles.tab} ${currentView === 'information' ? styles.activeTab : ''}`}
            onClick={() => handleTabClick('information', '66%')}
        >
            Thông tin
        </span>
        <div className={styles.underline} style={{ left: underlinePosition }}></div>
    </div>
    <div className={styles.component}>
        {currentView === 'user' && <User />}
        {currentView === 'chat' && <ChatBoxGroup />}
        {currentView === 'information' && <Information />}
    </div>
</div>
            </div>
            <div className={styles.buttonContainer}>
                <button onClick={toggleMic}>
                    {isMicOn ? <i className="fa-solid fa-microphone-slash"></i> : <i className="fa-solid fa-microphone"></i> }
                </button>
                {isAdmin && (
                    <>
                        <button onClick={toggleVideo}>
                            {isVideoOn ?  <i className="fa-solid fa-video"></i> : <i className="fa-solid fa-video-slash"></i> }
                        </button>
                        <button onClick={shareScreen}>
                            {isScreenSharing ? <i className="fa-solid fa-rectangle-xmark"></i> : <i className="fa-solid fa-display"></i>}
                        </button>
                    </>
                )}
                <button onClick={toggleDivVisibility}>
                    {isDivVisible ? <i className="fa-solid fa-comment"></i> : <i className="fa-solid fa-comment"></i>}
                </button>
                <button onClick={toggleDivVisibility}><i className="fa-solid fa-user-group"></i></button>
                <button onClick={endMeeting}><i className="fa-solid fa-phone" style={{ color: 'red' }}></i></button>
            </div>
            {isVideoOn && isAdmin && (
                <Draggable>
                    <video
                        className={styles.draggableVideo}
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                    />
                </Draggable>
            )}
            <div className={styles.footer}>
            </div>

        </div>
    );
};

export default VideoChat;
