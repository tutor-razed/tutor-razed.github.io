
export type GradeLevel = 'elementary' | 'middle' | 'high';

export type Tone = 
  | 'serious' 
  | 'satire' 
  | 'horror' 
  | 'inspirational' 
  | 'sci-fi' 
  | 'mystery' 
  | 'fairy_tale' 
  | 'cynical' 
  | 'random';

export type Improbability = 'realistic' | 'unusual' | 'weird' | 'absurd' | 'unhinged';

export interface Article {
  id: string;
  headline: string;
  subheadline: string;
  section: string;
  author: string;
  dateISO: string;
  tone: Tone;
  gradeLevel: GradeLevel;
  improbability: Improbability;
  constraints: string[];
  body: string;
}

export interface WordBank {
  adjectives: string[];
  subjects: string[];
  verbs: string[];
  objects: string[];
  locations: string[];
}

export interface Template {
  id: string;
  structure: string; // e.g., "{adj} {subject} {verb} {obj} in {location}"
}
