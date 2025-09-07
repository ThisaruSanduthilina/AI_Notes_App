import React from 'react';
import { Note } from '../../types/Note';
import { formatDistanceToNow } from 'date-fns';
import { TrashIcon, MicIcon, BellIcon, FileTextIcon } from 'lucide-react';
import { noteService } from '../../services/noteService';

interface NotesListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
}

const NotesList: React.FC<NotesListProps> = ({ 
  notes, 
  selectedNote, 
  onSelectNote, 
  onDeleteNote 
}) => {
  const handleDeleteNote = async (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await noteService.deleteNote(noteId);
        onDeleteNote(noteId);
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (notes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <FileTextIcon size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No notes found</p>
          <p className="text-sm">Create your first note to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onSelectNote(note)}
          className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
            selectedNote && selectedNote.id === note.id ? 'bg-blue-50 border-blue-200' : ''
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-900 truncate flex-1 mr-2">
              {note.title || 'Untitled'}
            </h3>
            <div className="flex items-center space-x-1 text-gray-400">
              {note.isVoiceNote && <MicIcon size={14} />}
              {note.reminder && note.reminder.isActive && <BellIcon size={14} />}
              <button
                onClick={(e) => handleDeleteNote(e, note.id)}
                className="p-1 hover:text-red-500 hover:bg-red-50 rounded"
              >
                <TrashIcon size={14} />
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            {truncateText(note.content)}
          </p>
          
          {note.summary && (
            <p className="text-xs text-indigo-600 mb-2 italic">
              Summary: {truncateText(note.summary, 80)}
            </p>
          )}
          
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{formatDistanceToNow(note.updatedAt, { addSuffix: true })}</span>
            {note.category && (
              <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                {note.category}
              </span>
            )}
          </div>
          
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {note.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {note.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{note.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotesList;