
import React from 'react';
import { RankingEntry } from '../types';

interface RankingProps {
  rankings: RankingEntry[];
  onBack: () => void;
}

const Ranking: React.FC<RankingProps> = ({ rankings, onBack }) => {
  const sortedRankings = [...rankings].sort((a, b) => b.score - a.score).slice(0, 10);

  return (
    <div className="flex flex-col p-10 bg-slate-900/95 rounded-3xl shadow-2xl max-w-3xl w-full mx-auto animate-in fade-in zoom-in duration-500 border border-emerald-900/50">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-black text-emerald-400 font-jua">
          <i className="fas fa-crown text-amber-500 mr-4"></i> 명예의 전당
        </h1>
        <button onClick={onBack} className="text-emerald-700 hover:text-emerald-500 text-4xl">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto max-h-[600px] pr-3 custom-scrollbar">
        {sortedRankings.length > 0 ? (
          sortedRankings.map((entry, idx) => (
            <div key={entry.id} className={`flex items-center gap-6 p-6 rounded-2xl border-2 ${idx === 0 ? 'bg-amber-950/40 border-amber-700 scale-[1.02]' : 'bg-slate-800/40 border-emerald-900/30'}`}>
              <div className={`w-14 h-14 flex items-center justify-center rounded-full font-black text-3xl ${idx === 0 ? 'bg-amber-500 text-amber-50 shadow-md' : 'bg-emerald-900/50 text-emerald-400'}`}>
                {idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-end">
                  <span className="font-black text-2xl text-emerald-50">{entry.name}</span>
                  <span className="text-4xl font-black text-emerald-400">{entry.score.toLocaleString()}</span>
                </div>
                <div className="text-lg text-emerald-600/70 flex flex-wrap gap-2 font-bold uppercase mt-2">
                  <span className="text-emerald-400">{entry.category}</span>
                  <span>•</span>
                  <span>{entry.mode}</span>
                  <span>•</span>
                  <span>Lv.{entry.level}</span>
                  <span>•</span>
                  <span className="text-rose-500">{entry.timer}초</span>
                  <span>•</span>
                  <span className="text-amber-500">{entry.difficulty}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 text-emerald-800 font-bold text-2xl">
            아직 기록된 랭킹이 없습니다.
          </div>
        )}
      </div>

      <button
        onClick={onBack}
        className="mt-10 w-full py-6 rounded-2xl bg-emerald-700/30 text-emerald-100 font-black text-3xl shadow-lg hover:bg-emerald-700/50 transition-colors border border-emerald-600/30"
      >
        돌아가기
      </button>
    </div>
  );
};

export default Ranking;
