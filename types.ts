
export type Level = 1 | 2 | 3;
export type HintDifficulty = '쉬움' | '보통' | '어려움';
export type GameMode = '싱글' | '협동';
export type TimerOption = 5 | 7 | 10;

export interface Question {
  word: string;
  hint: string;
}

export interface RankingEntry {
  id: string;
  name: string;
  category: string;
  level: Level;
  mode: GameMode;
  difficulty: HintDifficulty;
  timer: TimerOption;
  score: number;
  date: string;
}

export const CATEGORIES = [
  "색깔", "과일", "건물", "과목", "영어", "가수", 
  "코메디언", "연기자", "한국대통령", "한국역사적인물", 
  "한국도시", "한국문화재", "세계역사적인물", "세계도시", "세계문화재", "세계여러나라"
];

export const LEVEL_CONFIG = {
  1: { count: 5, label: "레벨 1" },
  2: { count: 10, label: "레벨 2" },
  3: { count: 15, label: "레벨 3" }
};
