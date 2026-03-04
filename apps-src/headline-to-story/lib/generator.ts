
import { TEMPLATES, WORD_BANKS, TONE_MODIFIERS, SECTIONS, FICTIONAL_ADS, CLASSIFIEDS } from '../constants';
import { GradeLevel, Improbability, Tone, Template, WordBank } from '../types';

export const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateHeadline = (
  template: Template,
  words: { adj: string; subject: string; verb: string; obj: string; location: string }
): string => {
  return template.structure
    .replace('{adj}', words.adj)
    .replace('{subject}', words.subject)
    .replace('{verb}', words.verb)
    .replace('{obj}', words.obj)
    .replace('{location}', words.location);
};

export const generateSubheadline = (headline: string, tone: Tone): string => {
  const modifiers = TONE_MODIFIERS[tone] || TONE_MODIFIERS['serious'];
  const prefix = getRandomItem(modifiers);
  return `${prefix} ${headline.slice(0, 1).toLowerCase() + headline.slice(1)} may never be the same again.`;
};

export const autoPickSection = (headline: string, tone: Tone): string => {
  const lowerH = headline.toLowerCase();
  if (lowerH.includes('robot') || lowerH.includes('tech') || lowerH.includes('algorithm')) return 'Tech';
  if (lowerH.includes('scientist') || lowerH.includes('space') || lowerH.includes('planet')) return 'Science';
  if (lowerH.includes('mayor') || lowerH.includes('law') || lowerH.includes('treaty')) return 'Politics';
  if (tone === 'horror' || tone === 'sci-fi' || tone === 'mystery') return 'Strange';
  if (tone === 'satire' || tone === 'cynical') return 'Opinion';
  return getRandomItem(['Local', 'Culture', 'Breaking News']);
};

export const generateRelatedHeadlines = (section: string, tone: Tone): string[] => {
  const related = [
    `Opinion: Why we should care about ${section}`,
    `Exclusive: New evidence in the ${tone} case`,
    `How to protect yourself from ${section} developments`,
    `A brief history of local ${tone} events`,
    `The top 10 things you missed in ${section} this week`
  ];
  return related.sort(() => Math.random() - 0.5).slice(0, 4);
};

export const generateTickerItems = (): string[] => {
  return [
    "LATEST: Local park to be closed for 'maintenance' following incident...",
    "WEATHER: Storm clouds gathering over the northern ridge...",
    "MARKETS: Stocks in imagination rise to record levels...",
    "TRAFFIC: Delays expected near the old clocktower...",
    "SPORTS: Local team wins game against invisible opponent..."
  ];
};

export const getFictionalAds = (count: number) => {
  return [...FICTIONAL_ADS].sort(() => Math.random() - 0.5).slice(0, count);
};

export const getClassifieds = (count: number) => {
  return [...CLASSIFIEDS].sort(() => Math.random() - 0.5).slice(0, count);
};

export const getRemixPrompt = (tone: Tone): string => {
  const prompts: Record<string, string[]> = {
    serious: ["Add a twist involving a forgotten law.", "Focus on the financial impact.", "Make the consequences felt by everyone."],
    satire: ["Make the villain actually a misunderstood toaster.", "Introduce a character who takes everything literally.", "Focus on a trivial detail that everyone ignores."],
    horror: ["The event happened at exactly midnight.", "Something is watching from the shadows.", "No one can leave the area."],
    inspirational: ["Focus on a small act of kindness that changes everything.", "A child holds the key to the solution.", "Show how the community comes together."],
    'sci-fi': ["It turns out this is a simulation.", "A visitor from the future is trying to stop it.", "The laws of physics start to break."],
    mystery: ["The key witness has disappeared.", "A strange symbol was found at the center of the event.", "Everyone has a secret motive."],
    fairy_tale: ["A talking animal offers cryptic advice.", "Three wishes are granted, but each has a price.", "Only a pure heart can resolve the conflict."],
    cynical: ["It's all a PR stunt for a big corporation.", "The hero only helps because they're bored.", "The 'solution' actually makes things worse."],
    random: ["Add a giraffe into the story for no reason.", "Suddenly, it starts raining pancakes.", "Everyone starts speaking in rhymes."]
  };
  const list = prompts[tone] || prompts['random'];
  return getRandomItem(list);
};
