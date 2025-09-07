import React, { useState, useEffect } from 'react';
import { Note, CreateNoteData, UpdateNoteData } from '../../types/Note';
import { useAuth } from '../../contexts/AuthContext';
import { noteService } from '../../services/noteService';
import { aiService } from '../../services/aiService';
import { 
  SaveIcon, 
  SparklesIcon, 
  MicIcon, 
  MicOffIcon,
  BellIcon,
  TagIcon,
  RefreshCwIcon
} from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';
import ReminderModal from './ReminderModal';

interface NoteEditorProps {
  note: Note | null;
  isCreating: boolean;
  onNoteCreated: (noteId: string) => void;
  onClose: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ 
  note, 
  isCreating, 
  onNoteCreated, 
  onClose 
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [summary, setSummary] = useState('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminder, setReminder] = useState<Note['reminder']>();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category || '');
      setTags(note.tags || []);
      setSummary(note.summary || '');
      setReminder(note.reminder);
    } else if (isCreating) {
      setTitle('');
      setContent('');
      setCategory('');
      setTags([]);
      setSummary('');
      setReminder(undefined);
    }
  }, [note, isCreating]);

  const handleSave = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      if (isCreating) {
        const noteData: CreateNoteData = {
          title: title || 'Untitled',
          content,
          category: category || undefined,
          tags,
        };
        const noteId = await noteService.createNote(currentUser.uid, noteData);
        onNoteCreated(noteId);
      } else if (note) {
        const updateData: UpdateNoteData = {
          title: title || 'Untitled',
          content,
          category: category || undefined,
          tags,
          summary,
          reminder,
        };
        await noteService.updateNote(note.id, updateData);
      }
    } catch (error) {
      console.error('Failed to save note:', error);
    }
    setIsLoading(false);
  };

  const handleSummarize = async () => {
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      const generatedSummary = await aiService.summarizeText(content);
      setSummary(generatedSummary);
      
      if (note) {
        await noteService.updateNote(note.id, { summary: generatedSummary });
      }
    } catch (error) {
      console.error('Failed to summarize:', error);
    }
    setIsLoading(false);
  };

  const handleGenerateTags = async () => {
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      const generatedTags = await aiService.extractTags(content + ' ' + title);
      setTags(generatedTags);
      
      if (note) {
        await noteService.updateNote(note.id, { tags: generatedTags });
      }
    } catch (error) {
      console.error('Failed to generate tags:', error);
    }
    setIsLoading(false);
  };

  const handleVoiceResult = (transcript: string) => {
    setContent(prev => prev + (prev ? '\n\n' : '') + transcript);
    setIsVoiceRecording(false);
  };

  const handleReminderSave = async (reminderData: Note['reminder']) => {
    setReminder(reminderData);
    if (note && reminderData) {
      try {
        await noteService.updateNote(note.id, { reminder: reminderData });
      } catch (error) {
        console.error('Failed to save reminder:', error);
      }
    }
    setShowReminderModal(false);
  };

  const addTag = (tagText: string) => {
    if (tagText.trim() && !tags.includes(tagText.trim())) {
      setTags([...tags, tagText.trim()]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (!isCreating && !note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <SparklesIcon size={64} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-medium mb-2">Welcome to AI Notes</h2>
          <p>Select a note to edit or create a new one to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 text-xl font-semibold border-none outline-none placeholder-gray-400"
          />
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsVoiceRecording(!isVoiceRecording)}
              className={`p-2 rounded-md ${
                isVoiceRecording 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Voice to text"
            >
              {isVoiceRecording ? <MicOffIcon size={20} /> : <MicIcon size={20} />}
            </button>
            <button
              onClick={() => setShowReminderModal(true)}
              className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
              title="Set reminder"
            >
              <BellIcon size={20} />
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <SaveIcon size={16} />
              <span>{isLoading ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            placeholder="Category (optional)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          />
          <button
            onClick={handleGenerateTags}
            disabled={isLoading || !content.trim()}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 disabled:opacity-50 flex items-center space-x-1"
          >
            <TagIcon size={14} />
            <span>Generate Tags</span>
          </button>
          <button
            onClick={handleSummarize}
            disabled={isLoading || !content.trim()}
            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200 disabled:opacity-50 flex items-center space-x-1"
          >
            <SparklesIcon size={14} />
            <span>Summarize</span>
          </button>
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center space-x-1"
              >
                <span>{tag}</span>
                <button
                  onClick={() => removeTag(tag)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col p-4">
        <textarea
          placeholder="Start writing your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 w-full border-none outline-none resize-none text-gray-900 placeholder-gray-400 leading-relaxed"
        />
        
        {summary && (
          <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-md">
            <h4 className="font-medium text-indigo-900 mb-2 flex items-center space-x-2">
              <SparklesIcon size={16} />
              <span>AI Summary</span>
            </h4>
            <p className="text-indigo-800 text-sm leading-relaxed">{summary}</p>
          </div>
        )}
        
        {reminder && reminder.isActive && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h4 className="font-medium text-yellow-900 mb-2 flex items-center space-x-2">
              <BellIcon size={16} />
              <span>Reminder Set</span>
            </h4>
            <p className="text-yellow-800 text-sm">
              {reminder.message} - {reminder.date.toLocaleDateString()} at {reminder.date.toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>
      
      {isVoiceRecording && (
        <VoiceRecorder
          onResult={handleVoiceResult}
          onStop={() => setIsVoiceRecording(false)}
        />
      )}
      
      {showReminderModal && (
        <ReminderModal
          note={note}
          onSave={handleReminderSave}
          onClose={() => setShowReminderModal(false)}
        />
      )}
    </div>
  );
};

export default NoteEditor;