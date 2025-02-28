import React, { useState } from 'react';
import { runMakePodcast } from '../scripts/make-podcast';
export const Hero = () => {
  const [status, setStatus] = useState('idle');
  const handleGeneratePodcast = async () => {
    setStatus('processing');
    try {
      await runMakePodcast();
      setStatus('done');
    } catch (_a) {
      setStatus('error');
    }
  };
  return (
    <div className="card">
      <button
        onClick={handleGeneratePodcast}
        disabled={status === 'processing'}
      >
        Generate Podcast
      </button>
      {status === 'processing' && <p>Processing...</p>}
      {status === 'error' && <p>Error occurred. Please try again.</p>}
      {status === 'done' && <p>Podcast generated successfully!</p>}
    </div>
  );
};
export default Hero;
