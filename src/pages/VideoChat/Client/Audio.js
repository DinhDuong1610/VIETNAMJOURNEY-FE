import React, { useState } from 'react';

function Audio() {
    const [isAudioOn, setIsAudioOn] = useState(true);

    const toggleAudio = () => {
        setIsAudioOn(!isAudioOn);
        // Thêm mã xử lý bật/tắt âm thanh ở đây, ví dụ: sử dụng WebRTC hoặc các API khác để bật/tắt mic
    };

    return (
        <button onClick={toggleAudio} style={{ fontSize: '16px', padding: '10px', cursor: 'pointer' }}>
            {isAudioOn ? (
                <i className="fa-solid fa-volume-up"></i> // Biểu tượng âm thanh bật
            ) : (
                <i className="fa-solid fa-volume-mute"></i> // Biểu tượng âm thanh tắt
            )}
        </button>
    );
}

export default Audio;
