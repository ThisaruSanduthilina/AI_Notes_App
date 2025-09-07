import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Note, CreateNoteData, UpdateNoteData } from '../types/Note';
import { v4 as uuidv4 } from 'uuid';

const NOTES_COLLECTION = 'notes';

export const noteService = {
  async createNote(userId: string, noteData: CreateNoteData): Promise<string> {
    try {
      const noteRef = await addDoc(collection(db, NOTES_COLLECTION), {
        ...noteData,
        id: uuidv4(),
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        tags: noteData.tags || [],
        isVoiceNote: noteData.isVoiceNote || false,
      });
      return noteRef.id;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  },

  async updateNote(noteId: string, updateData: UpdateNoteData): Promise<void> {
    try {
      const noteRef = doc(db, NOTES_COLLECTION, noteId);
      await updateDoc(noteRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  },

  async deleteNote(noteId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, NOTES_COLLECTION, noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  },

  async getUserNotes(userId: string): Promise<Note[]> {
    try {
      const q = query(
        collection(db, NOTES_COLLECTION),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        reminder: doc.data().reminder ? {
          ...doc.data().reminder,
          date: doc.data().reminder.date?.toDate() || new Date(),
        } : undefined,
      })) as Note[];
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  },

  subscribeToUserNotes(userId: string, callback: (notes: Note[]) => void) {
    const q = query(
      collection(db, NOTES_COLLECTION),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const notes = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        reminder: doc.data().reminder ? {
          ...doc.data().reminder,
          date: doc.data().reminder.date?.toDate() || new Date(),
        } : undefined,
      })) as Note[];
      callback(notes);
    });
  }
};