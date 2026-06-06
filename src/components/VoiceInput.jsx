import React, { useState, useEffect } from 'react';

function VoiceInput() {
  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState('');
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
  return <p>Your browser does not support voice recognition.</p>;
}

    useEffect(() => {
        // Create object for speech recognition        
        const recognition = new SpeechRecognition();

        // Set recognition properties
        recognition.continuous = true; // Keep listening until stopped
        recognition.lang = 'ru-RU'; // Set language
        // recognition.interimResults = true; // Show interim results

        // If results are returned, update the transcript with the recognized text
        recognition.onresult = (event) => {
            const currentTranscript = event.results[event.resultIndex][0].transcript;
            setTranscript((prev) => prev + ' ' + currentTranscript);
        };

        // Start or stop recognition based on isListening state
        if (isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }

        // Cleanup function to stop recognition when component unmounts
        return () => {
            recognition.stop();
        };
    }, [isListening]);

    // Render a button to toggle listening and display the transcript
    return (
        <div>
            <button onClick={() => setIsListening((prev) => !prev)}>
                {isListening ? '🎙 Stop Listening' : '🎙 Start Listening'}
            </button>
            <p>Transcript: {transcript}</p>
        </div>
    );
}

export default VoiceInput;