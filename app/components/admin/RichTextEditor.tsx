"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { extensions } from "@/app/lib/tiptap/extensions";

interface RichTextEditorProps {
  initialContent?: any;
  onChange: (json: any, html: string) => void;
}

export default function RichTextEditor({
  initialContent,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions,
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const html = editor.getHTML();
      onChange(json, html);
    },
    editorProps: {
      attributes: {
        class:
          "tiptap-editor prose prose-lg max-w-none p-6 min-h-[400px] text-gray-900 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/blog/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const { url } = await res.json();
          editor.chain().focus().setImage({ src: url }).run();
        } else {
          const data = await res.json().catch(() => ({}));
          alert(data.error || "Failed to upload image");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload image");
      }
    };
    input.click();
  };

  const addYouTubeVideo = () => {
    const url = prompt("Enter YouTube URL:");
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = prompt("Enter link URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-emerald-50 border-b-2 border-gray-300 p-3 flex flex-wrap gap-2">
        {/* Headings */}
        <select
          onChange={(e) => {
            const level = parseInt(e.target.value);
            if (level) {
              editor
                .chain()
                .focus()
                .toggleHeading({ level: level as any })
                .run();
            } else {
              editor.chain().focus().setParagraph().run();
            }
          }}
          className="px-3 py-1 rounded border border-gray-300 bg-white text-sm text-gray-900"
        >
          <option value="">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
        </select>

        <div className="w-px bg-gray-300" />

        {/* Text formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded font-bold text-sm ${
            editor.isActive("bold")
              ? "bg-emerald-600 text-white"
              : "bg-white hover:bg-gray-100 text-gray-900"
          }`}
        >
          B
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded italic text-sm ${
            editor.isActive("italic")
              ? "bg-emerald-600 text-white"
              : "bg-white hover:bg-gray-100 text-gray-900"
          }`}
        >
          I
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded line-through text-sm ${
            editor.isActive("strike")
              ? "bg-emerald-600 text-white"
              : "bg-white hover:bg-gray-100 text-gray-900"
          }`}
        >
          S
        </button>

        <div className="w-px bg-gray-300" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive("bulletList")
              ? "bg-emerald-600 text-white"
              : "bg-white hover:bg-gray-100 text-gray-900"
          }`}
        >
          • List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive("orderedList")
              ? "bg-emerald-600 text-white"
              : "bg-white hover:bg-gray-100 text-gray-900"
          }`}
        >
          1. List
        </button>

        <div className="w-px bg-gray-300" />

        {/* Link, Image, Video */}
        <button
          type="button"
          onClick={addLink}
          className="px-3 py-1 rounded bg-white hover:bg-gray-100 text-sm text-gray-900"
        >
          🔗 Link
        </button>

        <button
          type="button"
          onClick={addImage}
          className="px-3 py-1 rounded bg-white hover:bg-gray-100 text-sm text-gray-900"
        >
          🖼️ Image
        </button>

        <button
          type="button"
          onClick={addYouTubeVideo}
          className="px-3 py-1 rounded bg-white hover:bg-gray-100 text-sm text-gray-900"
        >
          ▶️ Video
        </button>

        <div className="w-px bg-gray-300" />

        {/* Table */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()
          }
          className="px-3 py-1 rounded bg-white hover:bg-gray-100 text-sm text-gray-900"
        >
          📊 Table
        </button>

        {editor.isActive("table") && (
          <>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="px-2 py-1 rounded bg-white hover:bg-gray-100 text-xs text-gray-900"
            >
              +Col
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="px-2 py-1 rounded bg-white hover:bg-gray-100 text-xs text-gray-900"
            >
              -Col
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="px-2 py-1 rounded bg-white hover:bg-gray-100 text-xs text-gray-900"
            >
              +Row
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="px-2 py-1 rounded bg-white hover:bg-gray-100 text-xs text-gray-900"
            >
              -Row
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-xs text-gray-900"
            >
              Delete Table
            </button>
          </>
        )}
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="bg-white" />
    </div>
  );
}
