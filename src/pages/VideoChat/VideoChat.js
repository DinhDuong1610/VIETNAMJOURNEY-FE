import React, { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { useLocation } from 'react-router-dom';
import styles from './VideoChat.module.css';
import User from './User/User.js';
import Information from './Information/Information.js';
import ChatBoxGroup from '../Messenger/ChatBox/ChatBoxGroup';
import { useCheckCookie } from '../../Cookie/getCookie.js';

const VideoChat = () => {
    const [isDivVisible, setIsDivVisible] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [currentView, setCurrentView] = useState('user');
    const [underlinePosition, setUnderlinePosition] = useState('0%');

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const screenShareRef = useRef(null);
    const peerConnectionRef = useRef(null);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const group_id = params.get('group_id');
    const thread = params.get('thread');
    const user_id = useCheckCookie('User_ID', '/TaiKhoan');
    console.log(group_id, user_id, thread);

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
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                if (screenShareRef.current) {
                    screenShareRef.current.srcObject = screenStream;
                }
                setIsScreenSharing(true);
                screenStream.getTracks().forEach((track) => {
                    peerConnectionRef.current.addTrack(track, screenStream);
                    track.onended = () => setIsScreenSharing(false);
                });
            } catch (error) {
                console.log('Error sharing screen:', error);
            }
        } else {
            if (screenShareRef.current && screenShareRef.current.srcObject) {
                const tracks = screenShareRef.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
                screenShareRef.current.srcObject = null;
                setIsScreenSharing(false);
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

    return (
        <div className={styles.container}>
            <div className={styles.flexContainer}>
                <div className={styles.videoContainer}>
                    <video 
                        className={styles.videoElement} 
                        ref={screenShareRef} 
                        autoPlay 
                        playsInline 
                        style={{ backgroundColor: isScreenSharing ? 'transparent' : '' }}
                    />
                </div>
                {isDivVisible && (
                    <div className={styles.chatBox}>
                        <div style={{ display: 'flex' }}>
                            <h4 style={{ marginLeft: '17px' }}>In-Meeting</h4>
                            <i 
                                style={{ marginLeft: 'auto', marginRight: '0.8rem', fontSize: '1.2rem', marginBottom: 'auto', marginTop: '0.3rem' }} 
                                className="fa-solid fa-x"
                                onClick={toggleDivVisibility}
                            ></i>
                        </div>
                        <div style={{  marginBottom: '0.3rem',textAlign : 'center' }}>
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
                )}
            </div>
            <div className={styles.buttonContainer}>
                <button onClick={toggleMic}>
                    {isMicOn ? <i className="fa-solid fa-microphone"></i> : <i className="fa-solid fa-microphone-slash"></i>}
                </button>
                <button onClick={toggleVideo}>
                    {isVideoOn ? <i className="fa-solid fa-video-slash"></i> : <i className="fa-solid fa-video"></i>}
                </button>
                <button onClick={shareScreen}>
                    {isScreenSharing ? <i className="fa-solid fa-rectangle-xmark"></i> : <i className="fa-solid fa-display"></i>}
                </button>
                <button onClick={toggleDivVisibility}>
                    {isDivVisible ? <i className="fa-solid fa-comment"></i> : <i className="fa-solid fa-comment"></i>}
                </button>
                <button><i className="fa-solid fa-user-group"></i></button>
                <button><i className="fa-solid fa-phone" style={{ color: 'red' }}></i></button>
            </div>
            {isVideoOn && (
                <Draggable>
                    <video
                        className={styles.draggableVideo}
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                    />
                </Draggable>
            )}
            <video ref={remoteVideoRef} autoPlay playsInline />
        </div>
    );
};

export default VideoChat;
