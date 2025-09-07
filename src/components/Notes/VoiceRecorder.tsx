import React, { useState, useEffect, useRef } from 'react';
import { MicIcon, StopCircleIcon, Loader2Icon } from 'lucide-react';

interface VoiceRecorderProps {
  onResult: (transcript: string) => void;
  onStop: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onResult, onStop }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.current = new SpeechRecognition();
    
    if (recognition.current) {
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';

      recognition.current.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognition.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptSegment;
          } else {
            interimTranscript += transcriptSegment;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognition.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };

      recognition.current.start();
    }

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []);

  const handleStop = () => {
    if (recognition.current) {
      recognition.current.stop();
    }
    if (transcript.trim()) {
      onResult(transcript.trim());
    }
    onStop();
  };

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-md">
        <p className="font-medium">Voice Recording Error</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={onStop}
          className="mt-2 px-3 py-1 bg-red-200 text-red-800 rounded text-sm hover:bg-red-300"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {isListening ? (
            <div className="animate-pulse">
              <MicIcon size={20} className="text-red-500" />
            </div>
          ) : (
            <Loader2Icon size={20} className="animate-spin text-gray-500" />
          )}
          <span className="font-medium text-gray-900">
            {isListening ? 'Listening...' : 'Processing...'}
          </span>
        </div>
        <button
          onClick={handleStop}
          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
        >
          <StopCircleIcon size={20} />
        </button>
      </div>
      
      {transcript && (
        <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-3">
          <p className="text-sm text-gray-700">{transcript}</p>
        </div>
      )}
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Speak clearly into your microphone</span>
        {isListening && (
          <div className="flex space-x-1">
            <div className="w-1 h-3 bg-red-400 animate-pulse"></div>
            <div className="w-1 h-4 bg-red-500 animate-pulse"></div>
            <div className="w-1 h-2 bg-red-400 animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;