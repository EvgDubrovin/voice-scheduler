import { useState, useEffect } from 'react';
import { processVoiceInput } from '../services/gemini';

function VoiceInput() {
  const [isListening, setIsListening] = useState(false);
  const [entries, setEntries] = useState([]);
  const [language, setLanguage] = useState('en-US');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  useEffect(() => {
    if (!SpeechRecognition) return;

    // Create object for speech recognition        
    const recognition = new SpeechRecognition();

    // Set recognition properties
    recognition.continuous = true; // Keep listening until stopped
    recognition.lang = ''; // Set language dynamically
    // recognition.interimResults = true; // Show interim results

    // If results are returned, process the recognized text with Gemini
    recognition.onresult = async (event) => {
      if (!event.results[event.resultIndex].isFinal) return;  
      const currentTranscript = event.results[event.resultIndex][0].transcript;
      try {
        const result = await processVoiceInput(currentTranscript);
        setEntries((prev) => [...prev, result]);
      } catch (error) {
        console.error("Error processing voice input:", error);
      }
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
  }, [isListening, SpeechRecognition]);

  if (!SpeechRecognition) {
    return <p>Your browser does not support voice recognition.</p>;
  }

  // Render a button to toggle listening and display the entries
  return (
    <div>
      <button onClick={() => setIsListening((prev) => !prev)}>
        {isListening ? '🎙 Stop Listening' : '🎙 Start Listening'}
      </button>
      <div>
        {entries.map((entry, index) => (
          <p key={index}>{entry}</p>
        ))}
      </div>
    </div>
  );
}

export default VoiceInput;
