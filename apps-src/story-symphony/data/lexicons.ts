
import { Prompt, Difficulty } from '../types';

export const SENSORY_WORDS = {
  sight: ['bright', 'dim', 'colorful', 'dark', 'shiny', 'glowing', 'transparent', 'vast', 'tiny', 'blurred'],
  sound: ['loud', 'quiet', 'whisper', 'thunder', 'echo', 'silent', 'melodic', 'hiss', 'crackle', 'rumble'],
  smell: ['stinky', 'fragrant', 'fresh', 'damp', 'floral', 'smoky', 'scented', 'perfumed', 'pungent'],
  taste: ['sweet', 'sour', 'bitter', 'salty', 'delicious', 'spicy', 'bland', 'creamy', 'acidic'],
  touch: ['rough', 'smooth', 'soft', 'hard', 'cold', 'hot', 'slimy', 'sharp', 'fuzzy', 'bumpy']
};

export const MOOD_BANKS = {
  joy: ['amazing', 'wonderful', 'joyful', 'ecstatic', 'brilliant', 'triumphant', 'happy', 'laughing', 'smiling', 'bliss', 'delight'],
  anger: ['furious', 'rage', 'hate', 'angry', 'shouted', 'slammed', 'cruel', 'vengeance', 'bitter', 'stormed', 'violent'],
  sadness: ['devastated', 'hopeless', 'lonely', 'grim', 'sad', 'cried', 'wept', 'empty', 'hollow', 'miserable', 'gloomy'],
  fear: ['terrified', 'scared', 'worried', 'dread', 'trembling', 'darkness', 'shaking', 'haunted', 'panic', 'hiding', 'shadows'],
  wonder: ['magic', 'curious', 'mysterious', 'glowing', 'infinite', 'sparkle', 'dream', 'unreal', 'starlight', 'breathless', 'stunning']
};

export const CONTRAST_WORDS = ['but', 'however', 'suddenly', 'yet', 'although', 'until', 'instead', 'at last'];

export const PROMPTS: Prompt[] = [
  { id: 'free', title: 'Free Write', promptText: 'Write whatever is on your mind today.' },
  { id: 'discovery', title: 'A Surprising Discovery', promptText: 'You find an old key in a place it shouldn’t be. What does it open?', suggestedDifficulty: Difficulty.BEGINNER },
  { id: 'fable', title: 'Aesop-style Fable', promptText: 'Write a short fable with animals and a lesson that is implied, not stated.', suggestedDifficulty: Difficulty.INTERMEDIATE },
  { id: 'choice', title: 'A Character Makes a Choice', promptText: 'A character must choose between two paths. Neither is perfect.', suggestedDifficulty: Difficulty.ADVANCED },
  { id: 'problem', title: 'Small Problem, Big Impact', promptText: 'A simple spilled glass of water leads to an unexpected adventure.', suggestedDifficulty: Difficulty.INTERMEDIATE },
  { id: 'door', title: 'The Secret Door', promptText: 'You find a hidden door in your school. What happens when you go inside?', suggestedDifficulty: Difficulty.BEGINNER },
  { id: 'time', title: 'Message from Future', promptText: 'You receive a letter from yourself, dated 50 years from now.', suggestedDifficulty: Difficulty.ADVANCED },
  { id: 'island', title: 'The Floating Island', promptText: 'Imagine a place where gravity is only a suggestion.', suggestedDifficulty: Difficulty.INTERMEDIATE },
  { id: 'friend', title: 'The Robot Friend', promptText: 'A robot is built to be a companion but develops its own dream.', suggestedDifficulty: Difficulty.BEGINNER },
  { id: 'storm', title: 'Before the Storm', promptText: 'The sky turned a color no one had ever seen before.', suggestedDifficulty: Difficulty.ADVANCED }
];

export const STRONG_VERBS: Record<string, string[]> = {
  'went': ['marched', 'dashed', 'crept', 'strolled', 'plodded', 'galloped'],
  'said': ['whispered', 'shouted', 'mumbled', 'declared', 'gasped', 'sighed'],
  'look': ['glance', 'stare', 'peer', 'inspect', 'behold', 'scan'],
  'run': ['sprint', 'scamper', 'bolt', 'jog', 'race', 'flee'],
  'eat': ['gobble', 'nibble', 'devour', 'feast', 'munch', 'savor'],
  'happy': ['jubilant', 'content', 'radiant', 'cheerful', 'elated', 'beaming']
};
