import { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';

interface UserNameEditorProps {
  currentName: string;
  onNameChange: (newName: string) => void;
}

export function UserNameEditor({ currentName, onNameChange }: UserNameEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(currentName);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const trimmedName = editedName.trim();
    
    // Validation
    if (!trimmedName) {
      setError('Name cannot be empty');
      return;
    }
    
    if (trimmedName.length > 30) {
      setError('Name must be 30 characters or less');
      return;
    }
    
    const forbiddenChars = /[<>{}[\]\\]/;
    if (forbiddenChars.test(trimmedName)) {
      setError('Name contains invalid characters');
      return;
    }
    
    // Save the name
    onNameChange(trimmedName);
    setIsEditing(false);
    setError(null);
  };

  const handleCancel = () => {
    setEditedName(currentName);
    setIsEditing(false);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium text-gray-700">{currentName}</span>
        <Edit2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </button>
    );
  }

  return (
    <div className="inline-flex flex-col gap-1">
      <div className="inline-flex items-center gap-2">
        <input
          type="text"
          value={editedName}
          onChange={(e) => {
            setEditedName(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your name"
          autoFocus
          maxLength={31}
        />
        <button
          onClick={handleSave}
          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          title="Save"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
          title="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {error && (
        <span className="text-xs text-red-600 px-3">{error}</span>
      )}
    </div>
  );
}
