
import React from 'react';
import { CATEGORIES, LEVEL_CONFIG, Level, HintDifficulty, GameMode, TimerOption } from '../types';
import SettingsModal from './SettingsModal';

interface HomeProps {
  onStartGame: (category: string, level: Level, difficulty: HintDifficulty, mode: GameMode, timer: TimerOption) => void;
  onViewRanking: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartGame, onViewRanking }) => {
  const [selectedCategory, setSelectedCategory] = React.useState(CATEGORIES[0]);
  const [selectedLevel, setSelectedLevel] = React.useState<Level>(1);
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<HintDifficulty>('보통');
  const [selectedMode, setSelectedMode] = React.useState<GameMode>('싱글');
  const [selectedTimer, setSelectedTimer] = React.useState<TimerOption>(5);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl max-w-3xl w-full mx-auto animate-in fade-in duration-700 border border-emerald-900/50 relative">
      <div className="flex justify-between w-full items-start mb-8">
        <div className="flex-1">
          <h1 className="text-6xl font-jua text-emerald-400 drop-shadow-[0_2px_10px_rgba(52,211,153,0.3)]">
            스피드 퀴즈
          </h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="bg-emerald-900/40 hover:bg-emerald-800/60 p-4 rounded-full text-emerald-400 transition-colors border border-emerald-700/30"
            title="설정"
          >
            <i className="fas fa-cog text-3xl"></i>
          </button>
          <button 
            onClick={onViewRanking}
            className="bg-emerald-900/40 hover:bg-emerald-800/60 p-4 rounded-full text-emerald-400 transition-colors border border-emerald-700/30"
            title="랭킹 보기"
          >
            <i className="fas fa-trophy text-3xl text-amber-500"></i>
          </button>
        </div>
      </div>
      
      <div className="w-full space-y-8">
        {/* Game Mode */}
        <section>
          <h2 className="text-2xl font-cafe24-magic mb-4 flex items-center gap-2 text-emerald-200">
            <i className="fas fa-users text-emerald-500"></i> 게임 모드
          </h2>
          <div className="flex gap-3">
            {(['싱글', '협동'] as GameMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMode(m)}
                className={`flex-1 py-4 rounded-xl text-xl font-bold transition-all border-2 ${
                  selectedMode === m 
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-[0_0_15px_rgba(5,150,105,0.4)]' 
                  : 'bg-emerald-950/40 text-emerald-400/60 border-emerald-900/50 hover:border-emerald-700'
                }`}
              >
                {m === '싱글' ? '나홀로 도전' : '둘이서 협동'}
              </button>
            ))}
          </div>
        </section>

        {/* Timer Option */}
        <section>
          <h2 className="text-2xl font-cafe24-magic mb-4 flex items-center gap-2 text-emerald-200">
            <i className="fas fa-hourglass-half text-rose-500"></i> 제한 시간
          </h2>
          <div className="flex gap-3">
            {([5, 7, 10] as TimerOption[]).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTimer(t)}
                className={`flex-1 py-4 rounded-xl text-xl font-bold transition-all border-2 ${
                  selectedTimer === t 
                  ? 'bg-rose-600 text-white border-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.4)]' 
                  : 'bg-emerald-950/40 text-emerald-400/60 border-emerald-900/50 hover:border-rose-900'
                }`}
              >
                {t}초
              </button>
            ))}
          </div>
        </section>

        {/* Hint Difficulty */}
        <section>
          <h2 className="text-2xl font-cafe24-magic mb-4 flex items-center gap-2 text-emerald-200">
            <i className="fas fa-brain text-amber-500"></i> 힌트 난이도
          </h2>
          <div className="flex gap-3">
            {(['쉬움', '보통', '어려움'] as HintDifficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`flex-1 py-4 rounded-xl text-xl font-bold transition-all border-2 ${
                  selectedDifficulty === d 
                  ? 'bg-amber-600 text-white border-amber-500 shadow-[0_0_15px_rgba(217,119,6,0.4)]' 
                  : 'bg-emerald-950/40 text-emerald-400/60 border-emerald-900/50 hover:border-amber-900'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </section>

        {/* Category */}
        <section>
          <h2 className="text-2xl font-cafe24-magic mb-4 flex items-center gap-2 text-emerald-200">
            <i className="fas fa-tags text-emerald-500"></i> 카테고리
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-3 custom-scrollbar border border-emerald-900/50 rounded-xl bg-black/20">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`p-3 rounded-lg text-lg font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-white shadow-sm scale-105 z-10'
                    : 'bg-emerald-950/60 text-emerald-300/70 hover:bg-emerald-900/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Level */}
        <section>
          <h2 className="text-2xl font-cafe24-magic mb-4 flex items-center gap-2 text-emerald-200">
            <i className="fas fa-signal text-teal-400"></i> 문제 개수
          </h2>
          <div className="flex gap-3">
            {(Object.keys(LEVEL_CONFIG) as unknown as Level[]).map((lv) => (
              <button
                key={lv}
                onClick={() => setSelectedLevel(Number(lv) as Level)}
                className={`flex-1 py-5 rounded-xl text-xl font-bold transition-all border-2 ${
                  selectedLevel === Number(lv)
                    ? 'bg-teal-600 text-white border-teal-500 shadow-[0_0_15px_rgba(13,148,136,0.4)]'
                    : 'bg-emerald-950/40 text-emerald-400/60 border-emerald-900/50 hover:border-teal-900'
                }`}
              >
                {LEVEL_CONFIG[lv as Level].count}문제
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={() => onStartGame(selectedCategory, selectedLevel, selectedDifficulty, selectedMode, selectedTimer)}
          className="w-full py-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-4xl font-black shadow-[0_10px_25px_rgba(5,150,105,0.4)] hover:brightness-110 active:scale-95 transition-all transform mt-6"
        >
          게임 시작!
        </button>
      </div>

      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
};

export default Home;
