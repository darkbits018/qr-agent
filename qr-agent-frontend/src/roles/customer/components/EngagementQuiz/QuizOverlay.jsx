import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function QuizOverlay({ isOpen, onClose, quiz }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    
    // Check if answer is correct
    const correct = answerIndex === quiz.questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 1);
    }
    
    // Delay moving to next question
    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setCompleted(true);
      }
    }, 1500);
  };
  
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setCompleted(false);
  };
  
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };
  
  const contentVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 25 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };
  
  if (!quiz) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black bg-opacity-70 z-50 carbon-veil"
            onClick={onClose}
          />
          
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-xl z-50 shadow-xl overflow-hidden"
          >
            <div className="bg-[#4C4C9D] text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">{quiz.title}</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white hover:bg-opacity-20">
                <X size={20} />
              </button>
            </div>
            
            {!completed ? (
              <div className="p-6">
                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
                  <motion.div
                    initial={{ width: `${(currentQuestion / quiz.questions.length) * 100}%` }}
                    animate={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                    className="h-full bg-green-500 rounded-full"
                  />
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">
                    Question {currentQuestion + 1} of {quiz.questions.length}
                  </h3>
                  <p className="text-xl">{quiz.questions[currentQuestion].question}</p>
                </div>
                
                <div className="space-y-3">
                  {quiz.questions[currentQuestion].answers.map((answer, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 rounded-lg text-left transition-colors ${
                        selectedAnswer === index 
                          ? isCorrect 
                            ? 'bg-green-100 border-green-500 border-2' 
                            : 'bg-red-100 border-red-500 border-2'
                          : 'bg-[#EEF1F4] hover:bg-[#E5E9F0]'
                      }`}
                      whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                      whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                    >
                      {answer}
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏆</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                <p className="text-[#7A7F87] mb-6">
                  You scored {score} out of {quiz.questions.length}
                </p>
                
                <div className="space-y-3">
                  <button 
                    onClick={resetQuiz}
                    className="w-full py-3 bg-[#4C4C9D] text-white rounded-lg font-medium"
                  >
                    Play Again
                  </button>
                  <button 
                    onClick={onClose}
                    className="w-full py-3 bg-[#EEF1F4] text-[#7A7F87] rounded-lg font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}