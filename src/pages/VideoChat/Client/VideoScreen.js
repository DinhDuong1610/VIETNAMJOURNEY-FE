import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SOCKET_URL from '../config/config';

function VideoScreen() {
    const ws = useRef(null);
    const videoRef = useRef(null);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const thread = params.get('thread');
    const mediaSource = useRef(null);
    const sourceBuffer = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket(SOCKET_URL);

        ws.current.onopen = () => {
            ws.current.send(JSON.stringify({ type: 'subscribe', thread_screen: thread }));
        };

        ws.current.onmessage = (event) => {
            if (typeof event.data !== 'string') {
                const mimeType = 'video/webm; codecs="vp9"'; // Hoặc tùy chỉnh nếu cần
                if (!MediaSource.isTypeSupported(mimeType)) {
                    console.error('MIME type không được hỗ trợ:', mimeType);
                    return;
                }

                const blob = new Blob([event.data], { type: mimeType });

                if (!mediaSource.current) {
                    mediaSource.current = new MediaSource();
                    videoRef.current.src = URL.createObjectURL(mediaSource.current);

                    mediaSource.current.addEventListener('sourceopen', () => {
                        try {
                            sourceBuffer.current = mediaSource.current.addSourceBuffer(mimeType);
                            sourceBuffer.current.addEventListener('updateend', () => {
                                if (mediaSource.current.readyState === 'ended') {
                                    mediaSource.current.endOfStream();
                                }
                            });

                            const reader = new FileReader();
                            reader.onload = () => {
                                const arrayBuffer = reader.result;
                                if (sourceBuffer.current && !sourceBuffer.current.updating) {
                                    sourceBuffer.current.appendBuffer(new Uint8Array(arrayBuffer));
                                }
                            };
                            reader.readAsArrayBuffer(blob);
                        } catch (error) {
                            console.error('Lỗi khi thêm SourceBuffer:', error);
                        }
                    });
                } else if (sourceBuffer.current && !sourceBuffer.current.updating) {
                    try {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const arrayBuffer = reader.result;
                            if (sourceBuffer.current) {
                                sourceBuffer.current.appendBuffer(new Uint8Array(arrayBuffer));
                            }
                        };
                        reader.readAsArrayBuffer(blob);
                    } catch (error) {
                        console.error('Lỗi khi append dữ liệu vào SourceBuffer:', error);
                    }
                }
            }
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            ws.current.close();
            if (mediaSource.current) {
                mediaSource.current.endOfStream();
            }
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
