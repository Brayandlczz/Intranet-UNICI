"use client";

import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

const BlogPostEditor: React.FC = () => {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p></p>",
    immediatelyRender: false, 
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none p-4 border border-gray-300 rounded-md min-h-[200px]",
      },
    },
  });

  const handleSave = async () => {
    if (!title.trim()) {
      setErrorMsg("El título es obligatorio");
      return;
    }
    if (!editor) return;

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const content = editor.getHTML();

    const { data, error } = await supabase.from("posts").insert([
      {
        title,
        content,
      },
    ]);

    setSaving(false);

    if (error) {
      setErrorMsg("Error guardando el post: " + error.message);
    } else {
      setSuccessMsg("Post guardado correctamente!");
      setTitle("");
      editor.commands.clearContent();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Crear nuevo post</h2>

      <input
        type="text"
        placeholder="Título del post"
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {editor ? (
        <EditorContent editor={editor} />
      ) : (
        <p>Cargando editor...</p>
      )}

      {errorMsg && <p className="mt-2 text-red-600">{errorMsg}</p>}
      {successMsg && <p className="mt-2 text-green-600">{successMsg}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Guardar Post"}
      </button>
    </div>
  );
};

export default BlogPostEditor;
