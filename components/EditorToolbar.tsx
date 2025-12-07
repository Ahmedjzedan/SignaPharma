"use client";

import { Bold, Italic, Link as LinkIcon, List, Image as ImageIcon, Heading1, Heading2, Quote } from "lucide-react";

interface ToolbarProps {
  onInsert: (text: string) => void;
}

export default function EditorToolbar({ onInsert }: ToolbarProps) {
  return (
    <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/50 rounded-t-xl overflow-x-auto">
      <button
        type="button"
        onClick={() => onInsert("**")}
        className="p-2 text-muted-foreground hover:text-primary hover:bg-background rounded-lg transition-colors"
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => onInsert("*")}
        className="p-2 text-muted-foreground hover:text-primary hover:bg-background rounded-lg transition-colors"
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-border mx-1" />
      <button
        type="button"
        onClick={() => onInsert("# ")}
        className="p-2 text-muted-foreground hover:text-primary hover:bg-background rounded-lg transition-colors"
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => onInsert("## ")}
        className="p-2 text-muted-foreground hover:text-primary hover:bg-background rounded-lg transition-colors"
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-border mx-1" />
      <button
        type="button"
        onClick={() => onInsert("- ")}
        className="p-2 text-muted-foreground hover:text-primary hover:bg-background rounded-lg transition-colors"
        title="List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => onInsert("> ")}
        className="p-2 text-muted-foreground hover:text-primary hover:bg-background rounded-lg transition-colors"
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-border mx-1" />
      <button
        type="button"
        onClick={() => onInsert("[Link text](url)")}
        className="p-2 text-muted-foreground hover:text-primary hover:bg-background rounded-lg transition-colors"
        title="Link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => onInsert("![Image alt](url)")}
        className="p-2 text-muted-foreground hover:text-primary hover:bg-background rounded-lg transition-colors"
        title="Image"
      >
        <ImageIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
