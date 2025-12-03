import { useState, useCallback, KeyboardEvent } from "react";

type UseInlineEditOptions = {
  initialText: string;
  onSave: (newText: string) => void;
};

export function useInlineEdit({ initialText, onSave }: UseInlineEditOptions) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(initialText);

  const startEdit = useCallback(() => {
    setEditText(initialText);
    setIsEditing(true);
  }, [initialText]);

  const saveEdit = useCallback(() => {
    if (editText.trim() !== "") {
      onSave(editText.trim());
    }
    setIsEditing(false);
  }, [editText, onSave]);

  const cancelEdit = useCallback(() => {
    setEditText(initialText);
    setIsEditing(false);
  }, [initialText]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") saveEdit();
      else if (e.key === "Escape") cancelEdit();
    },
    [saveEdit, cancelEdit]
  );

  return {
    isEditing,
    editText,
    setEditText,
    startEdit,
    saveEdit,
    cancelEdit,
    handleKeyDown,
  };
}

