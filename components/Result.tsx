
import React from 'react';
import { Level, GameMode, HintDifficulty, RankingEntry, TimerOption } from '../types';

interface ResultProps {
  score: number;
  total: number;
  totalTime: number;
  level: Level;
  mode: GameMode;
  difficulty: HintDifficulty;
  timer: TimerOption;
  category: string;
  answers: { word: string; isCorrect: boolean }[];
  onRestart: () => void;
  onSaveRanking: (entry: RankingEntry) => void;
}

const Result: React.FC<ResultProps> = ({ 
  score, total, totalTime, level, mode, difficulty, timer, category, answers, onRestart, onSaveRanking 
}) => {
  const [userName, setUserName] = React.useState('');
  const [hasSaved, setHasSaved] = React.useState(false);

  const avgRemainingTime = Math.max(0, (total * timer - totalTime) / total);
  const finalScoreValue = Math.round((score * 1000) + (avgRemainingTime * 200));

  const handleSave = () => {
    if (!userName.trim()) return;
    const entry: RankingEntry = {
      id: Date.now().toString(),
      name: userName,
      category,
      level,
      mode,
      difficulty,
      timer,
      score: finalScoreValue,
      date: new Date().toISOString()
    };
    onSaveRanking(entry);
    setHasSaved(true);
  };

  const percentage = Math.round((score / total) * 100);
  let feedback = "정말 대단합니다!";
  let icon = "fa-star";
  if (percentage < 40) feedback = "조금 더 연습해봐요!";
  else if (percentage < 80) feedback = "실력이 상당하시네요!";

  return (
    <div className="flex flex-col items-center p-10 bg-slate-900/90 rounded-3xl shadow-2xl max-w-3xl w-full mx-auto animate-in fade-in zoom-in duration-500 border border-emerald-900/50">
      <div className="text-center mb-8">
        <i className={`fas ${icon} text-8xl text-amber-500 mb-6 animate-bounce`}></i>
        <h1 className="text-5xl font-black text-emerald-100 mb-2">{feedback}</h1>
        <p className="text-2xl text-emerald-400 font-bold">{mode} 모드 / {difficulty} 난이도 / {timer}초</p>
      </div>

      <div className="grid grid-cols-2 gap-6 w-full mb-10">
        <div className="bg-emerald-950/60 p-6 rounded-2xl text-center border border-emerald-800/50">
          <p className="text-lg font-bold text-emerald-500 uppercase mb-2 font-cafe24-magic">최종 점수</p>
          <p className="text-6xl font-black text-emerald-100">{finalScoreValue.toLocaleString()}</p>
        </div>
        <div className="bg-amber-950/60 p-6 rounded-2xl text-center border border-amber-800/50">
          <p className="text-lg font-bold text-amber-500 uppercase mb-2 font-cafe24-magic">정답 수</p>
          <p className="text-6xl font-black text-amber-100">{score} / {total}</p>
        </div>
      </div>

      {!hasSaved ? (
        <div className="w-full bg-black/30 p-8 rounded-2xl mb-10 space-y-6 border border-emerald-900/50 shadow-inner">
          <h3 className="text-2xl font-black text-emerald-200 text-center font-cafe24-magic">명예의 전당에 이름을 남기세요!</h3>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="이름 입력"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="flex-1 px-6 py-4 rounded-xl border-2 border-emerald-900/50 focus:border-emerald-500 outline-none text-2xl font-bold bg-slate-900 text-emerald-100 placeholder:text-emerald-900"
            />
            <button 
              onClick={handleSave}
              disabled={!userName.trim()}
              className="px-10 py-4 bg-emerald-600 text-white text-2xl font-black rounded-xl hover:bg-emerald-500 disabled:opacity-50 transition-colors shadow-lg"
            >
              저장
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full bg-emerald-900/40 text-emerald-400 p-6 rounded-2xl mb-10 text-center text-2xl font-black border border-emerald-800/50">
          <i className="fas fa-check-circle mr-3"></i> 기록 저장 완료!
        </div>
      )}

      <div className="w-full mb-10 overflow-hidden rounded-2xl border border-emerald-900/50 shadow-sm">
        <div className="bg-slate-800/50 p-4 font-black text-emerald-500 text-xl flex justify-between font-cafe24-magic">
          <span>게임 요약</span>
          <span>{category}</span>
        </div>
        <div className="max-h-60 overflow-y-auto p-4 custom-scrollbar space-y-2 bg-slate-900/50">
          {answers.map((ans, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 rounded-lg text-xl border-b border-emerald-900/20 last:border-0">
              <span className="font-bold text-emerald-200">{ans.word}</span>
              <span className={ans.isCorrect ? 'text-emerald-400 font-black' : 'text-rose-500 font-bold'}>
                {ans.isCorrect ? '성공' : '실패'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onRestart}
        className="w-full py-6 rounded-2xl bg-emerald-700/30 text-emerald-100 text-3xl font-black shadow-lg hover:bg-emerald-700/50 transition-all active:scale-95 border border-emerald-600/30"
      >
        처음으로
      </button>
    </div>
  );
};

// Fixed: Add default export to resolve error in App.tsx
export default Result;
