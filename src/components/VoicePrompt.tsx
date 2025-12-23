import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff } from 'lucide-react';

interface VoicePromptProps {
  onTranscript: (transcript: string) => void;
  placeholder?: string;
}

const VoicePrompt: React.FC<VoicePromptProps> = ({ onTranscript, placeholder = 'Click the microphone to start speaking...' }) => {
  const [isListening, setIsListening] = useState(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  const handleToggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
    setIsListening(!isListening);
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggleListening}
        className={`p-3 rounded-full transition-colors ${
          isListening 
            ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        }`}
        title={isListening ? 'Stop recording' : 'Start recording'}
      >
        {listening ? (
          <div className="relative">
            <Mic className="h-5 w-5" />
            <div className="absolute -top-1 -right-1">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
          </div>
        ) : (
          <MicOff className="h-5 w-5" />
        )}
      </button>

      {transcript && (
        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default VoicePrompt;