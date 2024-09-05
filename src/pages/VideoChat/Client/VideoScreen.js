import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function VideoScreen() {
    const ws = useRef(null);
    const videoRef = useRef(null);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const thread = params.get('thread');

    useEffect(() => {
        ws.current = new WebSocket(`wss://socket.bwdjourney.id.vn:8080`);

        ws.current.onopen = () => {
            ws.current.send(JSON.stringify({ type: 'subscribe', thread_screen: thread }));
        };

        ws.current.onmessage = (event) => {
            if (typeof event.data !== 'string') {
                const blob = new Blob([event.data], { type: 'video/webm' });
                const videoUrl = URL.createObjectURL(blob);

                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                    videoRef.current.src = videoUrl;
                    videoRef.current.play().catch(error => {
                        console.error('Cannot play video:', error);
                    });
                }
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
        <video
            ref={videoRef}
            style={{ width: '100%', height: '100%', backgroundColor: 'black' }}
            autoPlay
            playsInline
        >
            Your browser does not support the video tag.
        </video>
    );
}

export default VideoScreen;