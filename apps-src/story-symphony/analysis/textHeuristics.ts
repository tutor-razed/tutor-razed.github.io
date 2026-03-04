
import { SentenceStat, AnalysisResult, AnalysisSummary, Tracks, Beats, MoodCategory, CustomLexicon, LinguisticProfile } from '../types';
import { SENSORY_WORDS, MOOD_BANKS, CONTRAST_WORDS } from '../data/lexicons';

const VERB_SUFFIXES = ['ing', 'ed', 'ize', 'ate', 'ify', 'en'];
const ADJ_SUFFIXES = ['ful', 'ous', 'ive', 'al', 'ic', 'able', 'ible', 'y', 'less', 'ish'];

export const analyzeText = (text: string, customLexicon?: CustomLexicon): AnalysisResult => {
  if (!text.trim()) {
    return createEmptyAnalysis();
  }

  const activeMoodBanks = { ...MOOD_BANKS };
  if (customLexicon) {
    Object.entries(customLexicon.mood).forEach(([cat, words]) => {
      const category = cat as MoodCategory;
      if (activeMoodBanks[category]) {
        activeMoodBanks[category] = [...activeMoodBanks[category], ...words];
      }
    });
  }

  const activeSensoryWords = { ...SENSORY_WORDS };
  if (customLexicon) {
    Object.entries(customLexicon.sensory).forEach(([type, words]) => {
      if ((activeSensoryWords as any)[type]) {
        (activeSensoryWords as any)[type] = [...(activeSensoryWords as any)[type], ...words];
      }
    });
  }

  const paragraphStrings = text.split(/\n\s*\n/);
  const sentences: SentenceStat[] = [];

  paragraphStrings.forEach((pStr, pIdx) => {
    const sStrings = pStr.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
    
    sStrings.forEach(s => {
      const textLower = s.toLowerCase();
      const rawWords = textLower.replace(/[.,!?;:()]/g, '').split(/\s+/).filter(w => w.length > 0);
      const wordCount = rawWords.length;

      let verbs = 0;
      let adjectives = 0;
      let nouns = 0;

      rawWords.forEach(w => {
        if (w.length < 3) return;
        if (VERB_SUFFIXES.some(sfx => w.endsWith(sfx))) verbs++;
        else if (ADJ_SUFFIXES.some(sfx => w.endsWith(sfx))) adjectives++;
        else nouns++;
      });

      const profile: LinguisticProfile = {
        verbDensity: wordCount > 0 ? verbs / wordCount : 0,
        adjectiveDensity: wordCount > 0 ? adjectives / wordCount : 0,
        nounDensity: wordCount > 0 ? nouns / wordCount : 0
      };

      const avgWordLen = wordCount > 0 ? rawWords.reduce((a, b) => a + b.length, 0) / wordCount : 0;
      const complexityRaw = (wordCount * 0.4) + (avgWordLen * 2.5);
      const complexityScore = Math.min(1, complexityRaw / 40);

      const scores: Record<MoodCategory, number> = {
        [MoodCategory.JOY]: 0, [MoodCategory.ANGER]: 0, [MoodCategory.SADNESS]: 0,
        [MoodCategory.FEAR]: 0, [MoodCategory.WONDER]: 0, [MoodCategory.NEUTRAL]: 0,
      };
      Object.entries(activeMoodBanks).forEach(([category, bank]) => {
        bank.forEach(w => { if (textLower.includes(w.toLowerCase())) scores[category as MoodCategory] += 1; });
      });

      let dominantCategory = MoodCategory.NEUTRAL;
      let maxScore = 0;
      Object.entries(scores).forEach(([cat, score]) => {
        if (score > maxScore) { maxScore = score; dominantCategory = cat as MoodCategory; }
      });

      let tensionScore = 0;
      if (s.includes('!')) tensionScore += 2;
      if (s.includes('?')) tensionScore += 1;
      if (s.includes(';')) tensionScore += 0.5;
      CONTRAST_WORDS.forEach(w => { if (textLower.includes(w)) tensionScore += 1.5; });
      tensionScore = Math.min(6, tensionScore);

      sentences.push({
        text: s,
        wordCount,
        paragraphIndex: pIdx,
        complexityScore,
        hasDialogue: /["“"”]|^-/.test(s),
        punctuationScore: (s.match(/[!?,.;:]/g) || []).length,
        hasEllipsis: s.includes('...'),
        hasSemicolon: s.includes(';'),
        sensoryHits: Object.values(activeSensoryWords).flat().filter(w => textLower.includes(w)).length,
        moodScore: Math.min(1, Object.values(scores).reduce((a, b) => a + b, 0) / 3),
        moodCategory: dominantCategory,
        tensionScore,
        linguisticProfile: profile
      });
    });
  });

  const tracks: Tracks = {
    rhythm: normalizeArray(sentences.map(s => s.wordCount)),
    mood: sentences.map(s => s.moodScore),
    moodCategory: sentences.map(s => s.moodCategory),
    tension: normalizeArray(sentences.map(s => s.tensionScore), 0, 6),
    sensory: normalizeArray(sentences.map(s => s.sensoryHits)),
    dialogue: sentences.map(s => s.hasDialogue ? 1 : 0),
    complexity: sentences.map(s => s.complexityScore),
    linguistic: sentences.map(s => s.linguisticProfile)
  };

  const summary: AnalysisSummary = {
    wordCount: sentences.reduce((acc, s) => acc + s.wordCount, 0),
    sentenceCount: sentences.length,
    paragraphCount: paragraphStrings.length,
    avgSentenceLen: sentences.length ? sentences.reduce((acc, s) => acc + s.wordCount, 0) / sentences.length : 0,
    dialogueCount: sentences.filter(s => s.hasDialogue).length,
    sensoryTotal: sentences.reduce((acc, s) => acc + s.sensoryHits, 0),
    tensionPeakIndex: tracks.tension.indexOf(Math.max(...tracks.tension))
  };

  return { sentences, tracks, beats: {}, summary };
};

const normalizeArray = (arr: number[], minVal?: number, maxVal?: number): number[] => {
  if (arr.length === 0) return [];
  const min = minVal !== undefined ? minVal : Math.min(...arr);
  const max = maxVal !== undefined ? maxVal : Math.max(...arr);
  return min === max ? arr.map(() => 0.5) : arr.map(v => (v - min) / (max - min));
};

const createEmptyAnalysis = (): AnalysisResult => ({
  sentences: [],
  tracks: { rhythm: [], mood: [], moodCategory: [], tension: [], sensory: [], dialogue: [], complexity: [], linguistic: [] },
  beats: {},
  summary: { wordCount: 0, sentenceCount: 0, paragraphCount: 0, avgSentenceLen: 0, dialogueCount: 0, sensoryTotal: 0, tensionPeakIndex: 0 }
});
