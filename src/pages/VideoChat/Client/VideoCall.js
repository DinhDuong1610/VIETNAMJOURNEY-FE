import Draggable from 'react-draggable';
import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function VideoCall() {
    const ws = useRef(null);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const thread = params.get('thread');

    const videoRef = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket(`ws://localhost:8080`);
        ws.current.onopen = () => {
            ws.current.send(JSON.stringify({ type: 'subscribe', thread: thread }));
        };

        ws.current.onmessage = (event) => {
            const receivedMessage = JSON.parse(event.data);
            if (receivedMessage.type === 'sendMessage') {
            }
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            ws.current.close();
        };
    }, [thread]);

    return (
        <Draggable>
            <video
                ref={videoRef} 
                style={{ width: '10rem', height: '10rem', backgroundColor: 'black',position : 'absolute',zIndex : '1000',cursor : 'move',borderRadius :'15px' }} 
                autoPlay
                playsInline
            >
                Trình duyệt của bạn không hỗ trợ thẻ video.
            </video>
        </Draggable>
    );
}

export default VideoCall;
