"use client";

import { ChangeEvent, ReactNode, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Heading from "@tiptap/extension-heading";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

import ResizableImage from "./resizeable-image";

import { createLowlight } from "lowlight";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Highlighter,
  List,
  ListOrdered,
  Quote,
  Code,
  Code2,
  LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Minimize2,
  Maximize,
} from "lucide-react";

import "./styles.css";
import { uploadImageToCloudinary } from "@/lib/uploadImage";

const lowlight = createLowlight();

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

interface ToolbarButtonProps {
  className?: string;
  children: ReactNode;
  onClick: () => void;
}

function ToolbarButton({ className, onClick, children }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={className}
      type="button"
    >
      { children }
    </button>
  );
}

export default function TiptapEditor({
  content = "",
  onChange,
}: TiptapEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Underline,
      Link,
      ResizableImage,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
      CodeBlockLowlight.configure({ lowlight }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    content,
    editorProps: {
      attributes: {
        "data-placeholder": "Write your post here...",
      },
      handleDrop: (view, event) => {
        const files = Array.from(event.dataTransfer?.files || []);
        const image = files.find((file) => /image/i.test(file.type));
        if (image) {
          handleImageUpload(image, view);
          return true;
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find((item) => /image/i.test(item.type));
        if (imageItem) {
          const file = imageItem.getAsFile();
          if (file) {
            handleImageUpload(file, view);
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  const handleImageUpload = async (file: File) => {
    // const reader = new FileReader();
    // reader.onload = async (e) => {
    //   const src = reader.result as string;
    //   editor?.chain().focus().setImage({ src }).run();
    // }

    // reader.readAsDataURL(file);
    try {
      const url = await uploadImageToCloudinary(file);

      editor?.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      alert("Image upload failed");
    }
  };

  const handleTriggerSelectFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      await handleImageUpload(file);
      e.target.value = '';
    }
  }

  if (!editor) return null;

  return (
    <div
      className={`tiptap-editor document-prose ${
        isFullscreen
          ? "fixed inset-0 w-screen h-screen bg-white z-50 p-8 max-w-none"
          : "relative w-full"
      }`}
    >
      <div className="toolbar">
        <ToolbarButton onClick={() => setIsFullscreen((v) => !v)}>
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize size={16} />}
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
          className={editor.isActive("heading", { level: 1 }) ? "active" : ""}
        >
          Heading 1
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={editor.isActive("heading", { level: 2 }) ? "active" : ""}
        >
          Heading 2
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={editor.isActive("heading", { level: 3 }) ? "active" : ""}
        >
          Heading 3
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "active" : ""}
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "active" : ""}
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "active" : ""}
        >
          <UnderlineIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "active" : ""}
        >
          <Strikethrough size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={editor.isActive("highlight") ? "active" : ""}
        >
          <Highlighter size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "active" : ""}
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "active" : ""}
        >
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "active" : ""}
        >
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "active" : ""}
        >
          <Code size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "active" : ""}
        >
          <Code2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const url = window.prompt("Enter URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className={editor.isActive("link") ? "active" : ""}
        >
          <LinkIcon size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => fileInputRef.current?.click()}>
          <ImageIcon size={16} />
        </ToolbarButton>
        {/* <ToolbarButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon size={16} /></ToolbarButton> */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "active" : ""}
        >
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={editor.isActive({ textAlign: "center" }) ? "active" : ""}
        >
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "active" : ""}
        >
          <AlignRight size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size={16} />
        </ToolbarButton>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleTriggerSelectFile}
      />
      <EditorContent
        editor={editor}
        className={`ProseMirror document-prose ${
          isFullscreen ? "w-full h-full !max-w-none" : ""
        }`}
      />
    </div>
  );
}
