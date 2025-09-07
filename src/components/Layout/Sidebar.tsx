import React from 'react';
import { FolderIcon, FileTextIcon } from 'lucide-react';

interface SidebarProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  notesCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  notesCount 
}) => {
  return (
    <div className="w-64 bg-gray-100 border-r border-gray-200 p-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Categories</h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => onCategorySelect('all')}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 ${
                  selectedCategory === 'all'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileTextIcon size={16} />
                <span>All Notes</span>
                <span className="ml-auto text-sm text-gray-500">({notesCount})</span>
              </button>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => onCategorySelect(category)}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 ${
                    selectedCategory === category
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FolderIcon size={16} />
                  <span className="capitalize">{category}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="pt-4 border-t border-gray-300">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Quick Stats</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Total Notes: {notesCount}</div>
            <div>Categories: {categories.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;