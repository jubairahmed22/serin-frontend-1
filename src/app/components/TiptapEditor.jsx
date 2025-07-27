'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import '../../styles/adminLayout.css';

const TiptapEditor = ({ value, onChange }) => {
  const [isClient, setIsClient] = useState(false);

  // Fix hydration error by rendering only after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[160px] focus:outline-none',
      },
    },
    // This line prevents SSR mismatch
    immediatelyRender: false,
  });

  if (!isClient || !editor) return null;

  return (
    <div className="border border-gray-300 fontPoppins rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-h-[200px]">
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
