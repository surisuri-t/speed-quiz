
import React from 'react';
import { Question, GameMode, TimerOption } from '../types';

interface GameProps {
  questions: Question[];
  mode: GameMode;
  timerLimit: TimerOption;
  onFinish: (score: number, answers: { word: string; isCorrect: boolean }[], totalTime: number) => void;
}

const Game: React.FC<GameProps> = ({ questions, mode, timerLimit, onFinish }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState<number>(timerLimit);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [history, setHistory] = React.useState<{ word: string; isCorrect: boolean }[]>([]);
  const [totalTimeTaken, setTotalTimeTaken] = React.useState(0);
  
  const timerRef = React.useRef<number | null>(null);

  const startQuestion = React.useCallback(() => {
    setTimeLeft(timerLimit);
    setShowAnswer(false);
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
  }, [currentIndex, timerLimit]);

  const handleTimeOut = () => {
    setShowAnswer(true);
  };

  const handleResult = (isCorrect: boolean) => {
    const timeSpentOnThis = timerLimit - timeLeft;
    setTotalTimeTaken(prev => prev + timeSpentOnThis);

    const currentWord = questions[currentIndex].word;
    const newHistory = [...history, { word: currentWord, isCorrect }];
    setHistory(newHistory);
    
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      onFinish(newScore, newHistory, totalTimeTaken + timeSpentOnThis);
    }
  };

  React.useEffect(() => {
    startQuestion();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, startQuestion]);

  const currentQ = questions[currentIndex];
  const currentPlayer = mode === '협동' ? (currentIndex % 2 === 0 ? '플레이어 1' : '플레이어 2') : null;

  return (
    <div className="flex flex-col items-center justify-center p-10 bg-slate-900/90 rounded-3xl shadow-2xl max-w-4xl w-full mx-auto min-h-[650px] relative overflow-hidden border border-emerald-900/50">
      {/* Progress & Info */}
      <div className="absolute top-0 left-0 w-full h-3 bg-slate-800">
        <div 
          className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 transition-all duration-300"
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        ></div>
      </div>

      {mode === '협동' && (
        <div className={`mb-6 px-10 py-2 rounded-full text-xl font-black uppercase tracking-wider ${currentIndex % 2 === 0 ? 'bg-emerald-900 text-emerald-300 border border-emerald-700' : 'bg-amber-900 text-amber-300 border border-amber-700'} animate-bounce`}>
          <i className="fas fa-user-circle mr-3"></i> {currentPlayer}의 차례!
        </div>
      )}

      <div className="w-full flex justify-between items-center mb-10">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-emerald-500 uppercase tracking-widest font-black">Progress</span>
          <span className="text-4xl font-black text-emerald-100">
            {currentIndex + 1} <span className="text-emerald-700">/</span> {questions.length}
          </span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-lg font-bold text-emerald-500 uppercase tracking-widest font-black">Remaining</span>
          <div className="relative flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-800" />
              <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="10" fill="transparent" 
                strokeDasharray={276}
                strokeDashoffset={276 - (timeLeft / timerLimit) * 276}
                className={`transition-all duration-100 ${timeLeft < 2 ? 'text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'text-emerald-400'}`}
              />
            </svg>
            <span className={`absolute text-4xl font-black tabular-nums ${timeLeft < 2 ? 'text-rose-500 animate-pulse' : 'text-emerald-100'}`}>
              {Math.ceil(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full text-center space-y-12">
        <div className="space-y-6">
          <p className="text-xl font-bold text-emerald-400 uppercase tracking-widest px-6 py-2 bg-emerald-900/50 rounded-full inline-block border border-emerald-800/50">
            Keyword Hint
          </p>
          <p className="text-5xl sm:text-7xl font-black text-emerald-50 leading-tight transition-all duration-300 animate-in zoom-in-95">
            {currentQ.hint}
          </p>
        </div>

        {showAnswer ? (
          <div className="space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-500 w-full">
             <div className="space-y-3">
                <h3 className="text-xl font-bold text-emerald-500 uppercase">정답</h3>
                <p className="text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(52,211,153,0.3)] font-jua">
                  {currentQ.word}
                </p>
             </div>
             <div className="flex gap-6 w-full">
               <button
                 onClick={() => handleResult(false)}
                 className="flex-1 py-6 rounded-2xl bg-slate-800 text-slate-400 font-black text-3xl hover:bg-slate-700 transition-all active:scale-95 border border-slate-700"
               >
                 <i className="fas fa-times mr-3"></i> 실패
               </button>
               <button
                 onClick={() => handleResult(true)}
                 className="flex-1 py-6 rounded-2xl bg-emerald-600 text-white font-black text-3xl hover:bg-emerald-500 transition-all active:scale-95 shadow-lg shadow-emerald-900/50"
               >
                 <i className="fas fa-check mr-3"></i> 성공!
               </button>
             </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-6">
            <div className="w-32 h-32 bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-400 text-6xl animate-pulse border border-emerald-800">
               <i className="fas fa-microphone"></i>
            </div>
            <p className="text-2xl text-emerald-300/60 font-bold">정답을 말하거나 아래 버튼을 누르세요</p>
          </div>
        )}
      </div>

      {!showAnswer && (
        <button
          onClick={() => {
            if (timerRef.current) clearInterval(timerRef.current);
            setShowAnswer(true);
          }}
          className="mt-16 w-full py-6 rounded-2xl bg-emerald-700/40 text-emerald-100 font-black text-3xl hover:bg-emerald-700/60 transition-all border border-emerald-600/30 shadow-xl active:scale-95"
        >
          정답 확인
        </button>
      )}
    </div>
  );
};

export default Game;
