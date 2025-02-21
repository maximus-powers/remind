import React, { useState } from 'react';

export const Hero: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'processing' | 'error' | 'done'>('idle');
    const [playStatus, setPlayStatus] = useState<'idle' | 'loading' | 'error' | 'playing'>('idle');

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
        // TODO: check if there are any in local storage already

        const response = await fetch('/api/data/audio', { method: 'GET' });
        const audioData = await response.json();

        console.log(audioData);
        
        if (!audioData || Object.keys(audioData).length === 0) {
            console.error('No audio data received');
            setPlayStatus('error');
            return;
        }

        console.log(audioData);

        // we have audioData, a dict with the fields below and their corresponding audio blobs
        const validAudioFields = ['intro', 'section1', 'section2', 'section3', 'conclusion'];

        // load them into audio buffers
        const audioContext = new AudioContext();
        const audioBuffers: { [key: string]: AudioBuffer } = {};

        for (const field of validAudioFields) {
            if (audioData[field]) {
                const arrayBuffer = new Uint8Array(audioData[field].data).buffer;
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                audioBuffers[field] = audioBuffer;
            }
        }

        // TODO: store in local storage

        // play the audio buffers in order
        const playAudioBuffer = async (buffer: AudioBuffer) => {
            return new Promise<void>((resolve) => {
                const source = audioContext.createBufferSource(); // default source (default speakers)
                source.buffer = buffer;
                source.connect(audioContext.destination);
                source.start();
                source.onended = () => resolve();
            });
        };

        setPlayStatus('playing');
        for (const field of validAudioFields) {
            if (audioBuffers[field]) {
                await playAudioBuffer(audioBuffers[field]);
            }
        }
        setPlayStatus('idle');
    };

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
        </div>
    );
};

export default Hero;
