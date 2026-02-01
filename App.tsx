
import React from 'react';
import Home from './components/Home';
import Game from './components/Game';
import Result from './components/Result';
import Ranking from './components/Ranking';
import { Level, Question, LEVEL_CONFIG, HintDifficulty, GameMode, RankingEntry, TimerOption } from './types';
import { fetchQuestions } from './services/geminiService';

type AppView = 'HOME' | 'LOADING' | 'GAME' | 'RESULT' | 'RANKING';

const App: React.FC = () => {
  const [view, setView] = React.useState<AppView>('HOME');
  const [category, setCategory] = React.useState('');
  const [level, setLevel] = React.useState<Level>(1);
  const [difficulty, setDifficulty] = React.useState<HintDifficulty>('보통');
  const [mode, setMode] = React.useState<GameMode>('싱글');
  const [timer, setTimer] = React.useState<TimerOption>(5);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [finalScore, setFinalScore] = React.useState(0);
  const [totalTime, setTotalTime] = React.useState(0);
  const [finalAnswers, setFinalAnswers] = React.useState<{ word: string; isCorrect: boolean }[]>([]);
  const [rankings, setRankings] = React.useState<RankingEntry[]>([]);

  // Load rankings from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('speed_quiz_rankings');
    if (saved) {
      try {
        setRankings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse rankings", e);
      }
    }
  }, []);

  const saveRanking = (entry: RankingEntry) => {
    const updated = [...rankings, entry];
    setRankings(updated);
    localStorage.setItem('speed_quiz_rankings', JSON.stringify(updated));
  };

  const handleStartGame = async (selectedCat: string, selectedLv: Level, selectedDiff: HintDifficulty, selectedMode: GameMode, selectedTimer: TimerOption) => {
    setCategory(selectedCat);
    setLevel(selectedLv);
    setDifficulty(selectedDiff);
    setMode(selectedMode);
    setTimer(selectedTimer);
    setView('LOADING');

    const count = LEVEL_CONFIG[selectedLv].count;
    try {
      const qs = await fetchQuestions(selectedCat, count, selectedDiff);
      setQuestions(qs);
      setView('GAME');
    } catch (err) {
      console.error(err);
      alert('문제를 가져오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      setView('HOME');
    }
  };

  const handleGameFinish = (score: number, answers: { word: string; isCorrect: boolean }[], time: number) => {
    setFinalScore(score);
    setFinalAnswers(answers);
    setTotalTime(time);
    setView('RESULT');
  };

  const handleRestart = () => {
    setView('HOME');
    setQuestions([]);
    setFinalScore(0);
    setFinalAnswers([]);
    setTotalTime(0);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      {view === 'HOME' && (
        <Home 
          onStartGame={handleStartGame} 
          onViewRanking={() => setView('RANKING')} 
        />
      )}
      
      {view === 'RANKING' && (
        <Ranking rankings={rankings} onBack={() => setView('HOME')} />
      )}
      
      {view === 'LOADING' && (
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="relative">
            <div className="w-24 h-24 border-8 border-emerald-500/10 border-t-emerald-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <i className="fas fa-leaf text-emerald-400 text-3xl"></i>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-black text-emerald-100">
               "{category}" 도전 중!
            </h2>
            <p className="text-emerald-400 font-bold mt-2">AI가 문제를 준비하고 있어요...</p>
          </div>
        </div>
      )}

      {view === 'GAME' && (
        <Game questions={questions} mode={mode} timerLimit={timer} onFinish={handleGameFinish} />
      )}

      {view === 'RESULT' && (
        <Result 
          score={finalScore} 
          total={questions.length} 
          totalTime={totalTime}
          level={level}
          mode={mode}
          difficulty={difficulty}
          timer={timer}
          category={category}
          answers={finalAnswers} 
          onRestart={handleRestart} 
          onSaveRanking={saveRanking}
        />
      )}
    </main>
  );
};

export default App;
