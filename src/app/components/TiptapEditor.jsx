'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import '../../styles/adminLayout.css';

const TiptapEditor = ({ value, onChange }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '', // initial load
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[160px] focus:outline-none',
      },
    },
    immediatelyRender: false,
  });

  // 🔑 Keep editor in sync when `value` changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false); 
    }
  }, [value, editor]);

  if (!isClient || !editor) return null;

  return (
    <div className="border border-gray-300 fontPoppins rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-h-[100px]">
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
