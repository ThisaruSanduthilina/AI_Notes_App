import React, { useState, useEffect } from 'react';
import { Note } from '../../types/Note';
import { aiService } from '../../services/aiService';
import { XIcon, BellIcon, SparklesIcon, CalendarIcon, ClockIcon } from 'lucide-react';

interface ReminderModalProps {
  note: Note | null;
  onSave: (reminder: Note['reminder']) => void;
  onClose: () => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({ note, onSave, onClose }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);

  useEffect(() => {
    if (note && note.reminder) {
      const reminderDate = note.reminder.date;
      setDate(reminderDate.toISOString().split('T')[0]);
      setTime(reminderDate.toTimeString().split(' ')[0].slice(0, 5));
      setMessage(note.reminder.message);
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
      setTime('09:00');
      setMessage('Review this note');
    }
  }, [note]);

  const handleGenerateSmartMessage = async () => {
    if (!note) return;

    setIsGeneratingMessage(true);
    try {
      const smartMessage = await aiService.generateSmartReminder(note.content, note.title);
      setMessage(smartMessage);
    } catch (error) {
      console.error('Failed to generate smart reminder:', error);
    }
    setIsGeneratingMessage(false);
  };

  const handleSave = () => {
    if (!date || !time || !message.trim()) return;

    const reminderDate = new Date(`${date}T${time}`);
    const reminderData: Note['reminder'] = {
      date: reminderDate,
      message: message.trim(),
      isActive: true,
    };

    onSave(reminderData);
  };

  const handleRemoveReminder = () => {
    onSave(undefined);
  };

  const quickDateOptions = [
    { label: 'Tomorrow', days: 1 },
    { label: 'In 3 days', days: 3 },
    { label: 'Next week', days: 7 },
    { label: 'In 2 weeks', days: 14 },
  ];

  const setQuickDate = (days: number) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    setDate(futureDate.toISOString().split('T')[0]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <BellIcon size={20} className="text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Set Reminder</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Quick Options
            </label>
            <div className="grid grid-cols-2 gap-2">
              {quickDateOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setQuickDate(option.days)}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <CalendarIcon size={16} className="inline mr-1" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <ClockIcon size={16} className="inline mr-1" />
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Reminder Message
              </label>
              {note && (
                <button
                  onClick={handleGenerateSmartMessage}
                  disabled={isGeneratingMessage}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50"
                >
                  <SparklesIcon size={12} />
                  <span>{isGeneratingMessage ? 'Generating...' : 'AI Smart Message'}</span>
                </button>
              )}
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your reminder message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none"
            />
          </div>

          {date && time && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                Reminder will be set for {new Date(`${date}T${time}`).toLocaleDateString()} at{' '}
                {new Date(`${date}T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div>
            {note && note.reminder && (
              <button
                onClick={handleRemoveReminder}
                className="px-4 py-2 text-red-600 hover:text-red-700 text-sm"
              >
                Remove Reminder
              </button>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!date || !time || !message.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              Set Reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;