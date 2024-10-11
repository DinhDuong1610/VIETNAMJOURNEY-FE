import React, { useState } from 'react';

function Audio() {
    const [isAudioOn, setIsAudioOn] = useState(true);

    const toggleAudio = () => {
        setIsAudioOn(!isAudioOn);
    };

    return (
        <button onClick={toggleAudio} style={{ fontSize: '16px', padding: '10px', cursor: 'pointer' }}>
            {isAudioOn ? (
                <i className="fa-solid fa-volume-up"></i> 
            ) : (
                <i className="fa-solid fa-volume-mute"></i> 
            )}
        </button>
    );
}

export default Audio;
