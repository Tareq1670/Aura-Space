"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    ImageIcon,
    LinkIcon,
    Undo2,
    Redo2,
    Minus,
} from "lucide-react";
import { useCallback, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

interface BlogEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
}

function ToolbarButton({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children,
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={cn(
                "flex items-center justify-center w-8 h-8 rounded-md transition-colors",
                isActive
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                disabled && "opacity-40 cursor-not-allowed"
            )}
        >
            {children}
        </button>
    );
}

function ToolbarSeparator() {
    return <div className="w-px h-6 bg-slate-200 mx-0.5" />;
}

export default function BlogEditor({
    content,
    onChange,
    placeholder = "Start writing your blog...",
    className,
}: BlogEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Image.configure({
                inline: false,
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: "text-indigo-600 underline" },
            }),
            Placeholder.configure({ placeholder }),
        ],
        content,
        onUpdate: ({ editor: e }) => {
            onChange(e.getHTML());
        },
        editorProps: {
            attributes: {
                class:
                    "prose prose-sm sm:prose max-w-none focus:outline-none min-h-[300px] px-4 py-3 text-slate-700",
            },
        },
    });

    const addImage = useCallback(() => {
        if (!editor) return;
        const url = window.prompt("Enter image URL:");
        if (url) editor.chain().focus().setImage({ src: url }).run();
    }, [editor]);

    const setLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes("link").href || "";
        const url = window.prompt("Enter URL:", previousUrl);
        if (url === null) return;
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }, [editor]);

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, { emitUpdate: false });
        }
    }, [content, editor]);

    if (!editor) return null;

    const charCount = editor.storage.characterCount?.characters?.() || editor.getText().length;

    return (
        <div className={cn("border border-slate-200 rounded-xl overflow-hidden bg-white", className)}>
            <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-slate-200 bg-slate-50 overflow-x-auto flex-nowrap lg:flex-wrap lg:overflow-visible">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarSeparator />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive("heading", { level: 1 })}
                    title="Heading 1"
                >
                    <Heading1 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive("heading", { level: 2 })}
                    title="Heading 2"
                >
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive("heading", { level: 3 })}
                    title="Heading 3"
                >
                    <Heading3 className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarSeparator />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                    title="Ordered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive("blockquote")}
                    title="Blockquote"
                >
                    <Quote className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarSeparator />

                <ToolbarButton onClick={addImage} title="Insert Image">
                    <ImageIcon className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={setLink}
                    isActive={editor.isActive("link")}
                    title="Insert Link"
                >
                    <LinkIcon className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Horizontal Rule"
                >
                    <Minus className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarSeparator />

                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Undo"
                >
                    <Undo2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Redo"
                >
                    <Redo2 className="w-4 h-4" />
                </ToolbarButton>
            </div>

            <EditorContent editor={editor} />

            <div className="flex items-center justify-end px-4 py-2 border-t border-slate-100 bg-slate-50">
                <span className="text-xs text-slate-400">{charCount} characters</span>
            </div>
        </div>
    );
}
