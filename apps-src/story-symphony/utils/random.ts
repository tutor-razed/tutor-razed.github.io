
import { MoodCategory } from '../types';

export const hashString = (str: string): number => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
};

export const generateId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const createPRNG = (seed: number) => {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) | 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export interface Palette {
  primary: string;
  secondary: string;
  accent: string;
  deep: string;     // New: for shadows/drips
  luminous: string; // New: for highlights/shimmer
  splatter: string;
  glow: string;
}

const hsla = (h: number, s: number, l: number, a: number = 1) => `hsla(${h}, ${s}%, ${l}%, ${a})`;

export const getCategoricalPalette = (category: MoodCategory, intensity: number): Palette => {
  const sat = 40 + (intensity * 50); 
  const light = 35 + (intensity * 35); 

  switch (category) {
    case MoodCategory.JOY:
      return {
        primary: hsla(45, sat, light), 
        secondary: hsla(30, sat, light - 10),
        accent: hsla(350, 90, 60),
        deep: hsla(20, 80, 20),
        luminous: hsla(50, 100, 90),
        splatter: hsla(45, 100, 40),
        glow: hsla(45, 100, 80, 0.4)
      };
    case MoodCategory.ANGER:
      return {
        primary: hsla(0, sat + 10, light - 15), 
        secondary: hsla(15, sat, 20),
        accent: hsla(25, 100, 50),
        deep: hsla(0, 100, 10),
        luminous: hsla(0, 100, 95),
        splatter: hsla(0, 80, 15),
        glow: hsla(0, 100, 50, 0.3)
      };
    case MoodCategory.SADNESS:
      return {
        primary: hsla(210, sat - 10, light), 
        secondary: hsla(240, 30, 25),
        accent: hsla(190, 60, 80),
        deep: hsla(220, 40, 10),
        luminous: hsla(180, 100, 98),
        splatter: hsla(210, 40, 25),
        glow: hsla(200, 50, 85, 0.25)
      };
    case MoodCategory.FEAR:
      return {
        primary: hsla(280, sat, light - 15), 
        secondary: hsla(270, 60, 15),
        accent: hsla(120, 70, 30),
        deep: hsla(280, 100, 5),
        luminous: hsla(270, 100, 95),
        splatter: hsla(280, 80, 12),
        glow: hsla(280, 100, 30, 0.4)
      };
    case MoodCategory.WONDER:
      return {
        primary: hsla(185, sat + 15, light + 5), 
        secondary: hsla(310, sat, light + 10),
        accent: hsla(270, 100, 85),
        deep: hsla(200, 100, 15),
        luminous: hsla(180, 100, 95),
        splatter: hsla(190, 100, 45),
        glow: hsla(180, 100, 90, 0.5)
      };
    default:
      return {
        primary: hsla(180, 10, 50), 
        secondary: hsla(0, 0, 85),
        accent: hsla(180, 20, 30),
        deep: hsla(0, 0, 10),
        luminous: hsla(0, 0, 100),
        splatter: hsla(0, 0, 30),
        glow: hsla(0, 0, 95, 0.2)
      };
  }
};
