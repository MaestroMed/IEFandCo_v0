"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, Heading2, Heading3,
  List, ListOrdered, Link as LinkIcon, Quote,
} from "lucide-react";

interface TiptapEditorProps {
  value: string; // JSON string
  onChange: (json: string, html: string) => void;
  placeholder?: string;
}

export function TiptapEditor({ value, onChange, placeholder }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener", class: "text-primary underline" } }),
      Placeholder.configure({ placeholder: placeholder || "Commencez a ecrire..." }),
    ],
    content: value ? safeParse(value) : "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const json = JSON.stringify(editor.getJSON());
      const html = editor.getHTML();
      onChange(json, html);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[400px] px-4 py-3",
      },
    },
  });

  // If value changes externally (e.g., loading existing post), update editor once
  useEffect(() => {
    if (editor && value) {
      const current = JSON.stringify(editor.getJSON());
      if (current !== value) {
        try {
          editor.commands.setContent(JSON.parse(value));
        } catch {
          /* noop */
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) {
    return (
      <div className="rounded-lg min-h-[500px]" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }} />
    );
  }

  const Btn = ({ active, onClick, icon: Icon, label }: { active?: boolean; onClick: () => void; icon: typeof Bold; label: string }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded transition-colors"
      style={{
        background: active ? "var(--bg-muted)" : "transparent",
        color: active ? "var(--color-copper)" : "var(--text-muted)",
      }}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className="rounded-lg overflow-hidden" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
      <div className="flex flex-wrap items-center gap-1 border-b px-2 py-1.5" style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}>
        <Btn
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={Bold}
          label="Gras"
        />
        <Btn
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={Italic}
          label="Italique"
        />
        <Btn
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          icon={UnderlineIcon}
          label="Barre"
        />
        <span className="mx-1 h-5 w-px" style={{ background: "var(--border)" }} />
        <Btn
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          icon={Heading2}
          label="Titre H2"
        />
        <Btn
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          icon={Heading3}
          label="Titre H3"
        />
        <span className="mx-1 h-5 w-px" style={{ background: "var(--border)" }} />
        <Btn
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={List}
          label="Liste"
        />
        <Btn
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={ListOrdered}
          label="Liste numerotee"
        />
        <Btn
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          icon={Quote}
          label="Citation"
        />
        <span className="mx-1 h-5 w-px" style={{ background: "var(--border)" }} />
        <Btn
          active={editor.isActive("link")}
          onClick={() => {
            const previous = editor.getAttributes("link").href as string | undefined;
            const url = window.prompt("URL", previous || "https://");
            if (url === null) return;
            if (url === "") {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            }
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
          icon={LinkIcon}
          label="Lien"
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function safeParse(v: string) {
  try {
    return JSON.parse(v);
  } catch {
    return "";
  }
}
