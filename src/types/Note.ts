export interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  reminder?: {
    date: Date;
    message: string;
    isActive: boolean;
  };
  isVoiceNote: boolean;
  category?: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tags?: string[];
  category?: string;
  isVoiceNote?: boolean;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  summary?: string;
  tags?: string[];
  category?: string;
  reminder?: {
    date: Date;
    message: string;
    isActive: boolean;
  };
}