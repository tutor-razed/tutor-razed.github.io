
export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

export enum LayoutMode {
  LINEAR = 'linear',
  SCATTER = 'scatter',
  CIRCULAR = 'circular',
  VORTEX = 'vortex'
}

export enum VisualStyle {
  PAINT = 'paint',
  CIRCLES = 'circles',
  STARS = 'stars',
  MIX = 'mix'
}

export enum MoodCategory {
  JOY = 'joy',
  ANGER = 'anger',
  SADNESS = 'sadness',
  FEAR = 'fear',
  WONDER = 'wonder',
  NEUTRAL = 'neutral'
}

export interface LinguisticProfile {
  verbDensity: number;      // Action
  adjectiveDensity: number; // Description
  nounDensity: number;      // Substance
}

export interface CustomLexicon {
  mood: Record<string, string[]>;
  sensory: Record<string, string[]>;
}

export interface SentenceStat {
  text: string;
  wordCount: number;
  paragraphIndex: number;
  complexityScore: number; // 0-1
  hasDialogue: boolean;
  punctuationScore: number;
  hasEllipsis: boolean;
  hasSemicolon: boolean;
  sensoryHits: number;
  moodScore: number; // Magnitude 0-1
  moodCategory: MoodCategory;
  tensionScore: number;
  linguisticProfile: LinguisticProfile;
}

export interface AnalysisSummary {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  avgSentenceLen: number;
  dialogueCount: number;
  sensoryTotal: number;
  tensionPeakIndex: number;
}

export interface Beats {
  incitingIndex?: number;
  climaxIndex?: number;
  resolutionIndex?: number;
}

export interface Tracks {
  rhythm: number[];
  mood: number[];
  moodCategory: MoodCategory[];
  tension: number[];
  sensory: number[];
  dialogue: number[];
  complexity: number[];
  linguistic: LinguisticProfile[];
}

export interface AnalysisResult {
  sentences: SentenceStat[];
  tracks: Tracks;
  beats: Beats;
  summary: AnalysisSummary;
}

export interface Project {
  id: string;
  title: string;
  text: string;
  createdAt: number;
  updatedAt: number;
  difficulty: Difficulty;
  layoutMode: LayoutMode;
  visualStyle?: VisualStyle; // Added visualStyle
  promptId: string;
  constraints: string[];
  analysisCache?: AnalysisResult;
}

export interface GlobalSettings {
  defaultDifficulty: Difficulty;
  theme: Theme;
  focusModeDefault: boolean;
  reduceMotion: boolean;
  customLexicon: CustomLexicon;
}

export interface Prompt {
  id: string;
  title: string;
  promptText: string;
  suggestedDifficulty?: Difficulty;
}
