
import { Article } from '../types';

const STORAGE_KEY = 'headline_to_story_articles';
const DRAFT_KEY = 'headline_to_story_draft';

export const saveArticle = (article: Article): void => {
  const articles = getAllArticles();
  articles.push(article);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  // Note: We no longer clear the draft here so users can go back and edit or see their work.
};

export const getAllArticles = (): Article[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const getArticleById = (id: string): Article | undefined => {
  return getAllArticles().find((a) => a.id === id);
};

export const saveDraft = (draft: any): void => {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
};

export const getDraft = (): any | null => {
  const stored = localStorage.getItem(DRAFT_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const clearDraft = (): void => {
  localStorage.removeItem(DRAFT_KEY);
};
