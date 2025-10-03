// Add to your imports
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaTimes } from 'react-icons/fa';

// Add this component to your ChatPage
const VoicePulseOverlay = ({ isOpen, onClose, onVoiceSubmit }) => {
  const [volume, setVolume] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Audio analysis setup
  useEffect(() => {
    if (!isOpen) return;

    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;
        
        const analyser = audioContext.createAnalyser();
        analyserRef.current = analyser;
        analyser.fftSize = 256;
        
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        
        const bufferLength = analyser.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
        
        setIsRecording(true);
        startAnimation();
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    };

    initAudio();

    return () => {
      stopRecording();
    };
  }, [isOpen]);

  const startAnimation = () => {
    const updateVolume = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const sum = dataArrayRef.current.reduce((a, b) => a + b, 0);
      const avg = sum / dataArrayRef.current.length;
      
      // Scale volume to 0-100 range with sensitivity boost
      const scaledVolume = Math.min(100, Math.max(0, avg * 1.5));
      setVolume(scaledVolume);
      
      animationRef.current = requestAnimationFrame(updateVolume);
    };
    animationRef.current = requestAnimationFrame(updateVolume);
  };

  const stopRecording = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsRecording(false);
    setVolume(0);
  };

  const handleSubmit = () => {
    stopRecording();
    onClose();
    // Here you would add actual voice processing logic
    onVoiceSubmit("Voice message recorded!");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative w-full max-w-md p-6">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-purple-300 transition-colors"
            >
              <FaTimes size={24} />
            </button>
            
            <div className="flex flex-col items-center">
              <motion.div
                className="relative mb-8"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                {/* Main pulse circle */}
                <motion.div
                  className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center"
                  animate={{ 
                    scale: 1 + (volume / 100) * 0.5,
                  }}
                  transition={{ 
                    type: "spring",
                    damping: 10,
                    stiffness: 300,
                    mass: 0.5
                  }}
                >
                  {/* Inner heartbeat circle */}
                  <motion.div
                    className="w-32 h-32 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ 
                      duration: 0.8,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <FaMicrophone className="text-white text-4xl" />
                  </motion.div>
                </motion.div>
                
                {/* Audio reactive particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-0 left-0 w-full h-full"
                    initial={{ rotate: i * 45 }}
                  >
                    <motion.div
                      className="absolute top-0 left-1/2 w-4 h-4 bg-white rounded-full -mt-2 -ml-2"
                      animate={{ 
                        y: volume / 5,
                        scale: 0.7 + (volume / 100) * 0.8,
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Visualizer bars */}
              <div className="flex items-end justify-center h-16 gap-1 w-full max-w-xs mb-8">
                {[...Array(16)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-3 bg-gradient-to-t from-purple-500 to-purple-300 rounded-t"
                    animate={{ 
                      height: volume * (0.3 + Math.random() * 0.7) / 100 * 64,
                    }}
                    transition={{ 
                      type: "spring",
                      damping: 30,
                      stiffness: 200
                    }}
                  />
                ))}
              </div>
              
              {/* Recording indicator */}
              <motion.div
                className="flex items-center mb-8"
                animate={{ opacity: isRecording ? 1 : 0.5 }}
              >
                <motion.div
                  className="w-4 h-4 bg-red-500 rounded-full mr-2"
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity
                  }}
                />
                <span className="text-white font-medium">
                  {isRecording ? "Recording..." : "Starting..."}
                </span>
              </motion.div>
              
              {/* Submit button */}
              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
              >
                Send Voice Message
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Add this state to your ChatPage component
const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);

// Add this function to handle voice submission
const handleVoiceSubmit = (message) => {
  // Here you would process the voice message
  // For now, we'll just send it as a text message
  sendMessage({
    id: Date.now(),
    text: message,
    sender: 'user',
    timestamp: new Date().toISOString()
  });
};

// Add this inside your ChatPage return statement
{showVoiceOverlay && (
  <VoicePulseOverlay 
    isOpen={showVoiceOverlay}
    onClose={() => setShowVoiceOverlay(false)}
    onVoiceSubmit={handleVoiceSubmit}
  />
)}

// Update your InputSection component to include the mic button
// (Add this to your InputSection component)
<button 
  onClick={() => setShowVoiceOverlay(true)}
  className="p-2 text-purple-600 hover:text-purple-800 transition-colors"
>
  <FaMicrophone size={20} />
</button>