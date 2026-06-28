import { useState, useEffect } from 'react';
import { processVoiceInput } from '../services/ai';
import { useAuth } from '../context/UserContext';
import { getGoogleAccessToken } from '../services/googleAuth';
import { appendRow } from '../services/sheets';

function VoiceInput() {
  const [isListening, setIsListening] = useState(false);
  const [entries, setEntries] = useState([]);
  const { accessToken, setAccessToken, spreadsheetId } = useAuth();
  console.log('accessToken:', accessToken, 'spreadsheetId:', spreadsheetId);
//   const [language, setLanguage] = useState('en-US');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  useEffect(() => {
    if (!SpeechRecognition) return;

    // Create object for speech recognition        
    const recognition = new SpeechRecognition();

    // Set recognition properties
    recognition.continuous = true; // Keep listening until stopped
    recognition.lang = 'ru-RU'; // Set language to Russian (you can change this to 'en-US' for English)
    // recognition.interimResults = true; // Show interim results

    // If results are returned, process the recognized text with Gemini
    recognition.onresult = async (event) => {
      if (!event.results[event.resultIndex].isFinal) return;
      const currentTranscript = event.results[event.resultIndex][0].transcript;
      console.log('Распознано:', currentTranscript);
      try {
        const results = await processVoiceInput(currentTranscript);
        setEntries((prev) => [...prev, ...results]);

        // If we have the necessary credentials, append the results to Google Sheets
        if (accessToken && spreadsheetId) {
          for (const entry of results) {
            await appendRow(accessToken, spreadsheetId, entry);
          }
        } else {
          console.warn('Missing accessToken or spreadsheetId; skip appending rows to Sheets.');
        }
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
  }, [isListening, SpeechRecognition, accessToken, spreadsheetId]);

  if (!SpeechRecognition) {
    return <p>Your browser does not support voice recognition.</p>;
  }

  const handleToggleListening = async () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      if (!accessToken) {
        const token = await getGoogleAccessToken();
        if (typeof setAccessToken === 'function') {
          setAccessToken(token);
        }
      }
      setIsListening(true);
    } catch (error) {
      console.error('Error obtaining Google access token:', error);
    }
  };

  // Render a button to toggle listening and display the entries
  return (
    <div>
      <button onClick={handleToggleListening}>
        {isListening ? '🎙 Stop Listening' : '🎙 Start Listening'}
      </button>
      <div>
        {entries.map((entry, index) => (
          <p key={index}>{entry.date} {entry.time} — {entry.activity}</p>
        ))}
      </div>
    </div>
  );
}

export default VoiceInput;
