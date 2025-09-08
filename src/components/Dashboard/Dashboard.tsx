import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Note } from '../../types/Note';
import { noteService } from '../../services/noteService';
import NotesList from '../Notes/NotesList';
import NoteEditor from '../Notes/NoteEditor';
import Header from '../Layout/Header';
import Sidebar from '../Layout/Sidebar';
import { PlusIcon } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const unsubscribe = noteService.subscribeToUserNotes(
      currentUser.uid,
      (fetchedNotes) => {
        setNotes(fetchedNotes);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleCreateNote = () => {
    setSelectedNote(null);
    setIsCreating(true);
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsCreating(false);
  };

  const handleNoteCreated = (noteId: string) => {
    setIsCreating(false);
    const createdNote = notes.find(note => note.id === noteId);
    if (createdNote) {
      setSelectedNote(createdNote);
    }
  };

  const handleNoteDeleted = (noteId: string) => {
    if (selectedNote && selectedNote.id === noteId) {
      setSelectedNote(null);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(notes.map(note => note.category).filter((category): category is string => Boolean(category))));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header 
        onLogout={handleLogout} 
        userEmail={currentUser?.email || ''}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          notesCount={notes.length}
        />
        
        <div className="flex-1 flex">
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={handleCreateNote}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center gap-2"
              >
                <PlusIcon size={16} />
                New Note
              </button>
            </div>
            
            <NotesList
              notes={filteredNotes}
              selectedNote={selectedNote}
              onSelectNote={handleSelectNote}
              onDeleteNote={handleNoteDeleted}
            />
          </div>
          
          <div className="flex-1">
            <NoteEditor
              note={selectedNote}
              isCreating={isCreating}
              onNoteCreated={handleNoteCreated}
              onClose={() => {
                setIsCreating(false);
                setSelectedNote(null);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;