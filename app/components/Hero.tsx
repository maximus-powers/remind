import React, { useState, useEffect } from 'react';

export const Hero: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'processing' | 'error' | 'done'>('idle');
    const [playStatus, setPlayStatus] = useState<'idle' | 'loading' | 'error' | 'playing'>('idle');
    const [audioUrls, setAudioUrls] = useState<{ [key: string]: string }>({});

    const handleGeneratePodcast = async () => {
        setStatus('processing');
        try {
            const response = await fetch('/api/data/audio', { method: 'POST' });
            const result = await response.json();
            if (response.ok) {
                setStatus('done');
            } else {
                console.error(result.error);
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    const playPodcast = async () => {
        setPlayStatus('loading');
        try {
            const response = await fetch('/api/data/audio?signedUrls=true', { method: 'GET' });
            const audioData = await response.json();

            if (!audioData || Object.keys(audioData).length === 0) {
                console.error('No audio data received');
                setPlayStatus('error');
                return;
            }

            setAudioUrls(audioData);
            setPlayStatus('playing');
        } catch (error) {
            console.error(error);
            setPlayStatus('error');
        }
    };

    useEffect(() => {
        if (playStatus === 'playing') {
            const audioElements = document.querySelectorAll('audio');
            let currentIndex = 0;

            const playNext = () => {
                if (currentIndex < audioElements.length) {
                    const audioElement = audioElements[currentIndex] as HTMLAudioElement;
                    audioElement.play().catch((error) => {
                        console.error('Error playing audio:', error);
                        setPlayStatus('error');
                    });
                    audioElement.onended = () => {
                        currentIndex++;
                        playNext();
                    };
                } else {
                    setPlayStatus('idle');
                }
            };

            playNext();
        }
    }, [playStatus]);

    return (
        <div className="card">
            <button onClick={handleGeneratePodcast} disabled={status === 'processing'}>
                Generate Podcast
            </button>
            {status === 'processing' && <p>Processing...</p>}
            {status === 'error' && <p>Error occurred. Please try again.</p>}
            {status === 'done' && <p>Podcast generated successfully!</p>}

            <button onClick={playPodcast} disabled={playStatus === 'loading' || playStatus === 'playing'}>
                Play Podcast
            </button>
            {playStatus === 'loading' && <p>Loading audio...</p>}
            {playStatus === 'error' && <p>Error occurred while loading audio. Please try again.</p>}
            {playStatus === 'playing' && <p>Playing podcast...</p>}

            {Object.keys(audioUrls).map((key) => (
                <audio key={key} src={audioUrls[key]} controls />
            ))}
        </div>
    );
};

export default Hero;
