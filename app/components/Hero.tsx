import React, { useState } from 'react';

export const Hero: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'processing' | 'error' | 'done'>('idle');

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

    return (
        <div className="card">
            <button onClick={handleGeneratePodcast} disabled={status === 'processing'}>
                Generate Podcast
            </button>
            {status === 'processing' && <p>Processing...</p>}
            {status === 'error' && <p>Error occurred. Please try again.</p>}
            {status === 'done' && <p>Podcast generated successfully!</p>}
        </div>
    );
};

export default Hero;
