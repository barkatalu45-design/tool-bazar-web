export type CategoryId =
  | 'media'
  | 'text'
  | 'stylish-text'
  | 'text-design'
  | 'developer'
  | 'pdf'
  | 'image'
  | 'calculators'
  | 'date-time'
  | 'device'
  | 'files'
  | 'colors'
  | 'generators'
  | 'student'
  | 'network'
  | 'everyday'
  | 'creative-studio'
  | 'creative-notes'
  | 'creative-stylish'
  | 'creative-fonts'
  | 'creative-audio'
  | 'creative-creator';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  color: string;
  toolCount?: number;
}

export interface Tool {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  keywords: string[];
  icon: string;
  isPopular?: boolean;
  isNew?: boolean;
  badge?: string;
}

export type ThemeMode = 'light' | 'dark';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}
