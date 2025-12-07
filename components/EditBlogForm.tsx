"use client";

import ReactMarkdown from "react-markdown";
import EditorToolbar from "@/components/EditorToolbar";
import { useRef, useState } from "react";
import clsx from "clsx";
import { updatePost } from "@/app/actions/blog";
import { PenTool, Image as ImageIcon, Tag, Type, AlignLeft, Loader2, Save } from "lucide-react";
import { useFormStatus } from "react-dom";

interface EditBlogFormProps {
  post: {
    id: string;
    title: string;
    content: string;
    category: string | null;
    imageUrl: string | null;
  };
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Saving Changes...
        </>
      ) : (
        <>
          <Save className="w-5 h-5" />
          Update Post
        </>
      )}
    </button>
  );
}

export default function EditBlogForm({ post }: EditBlogFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState(post.content);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const handleInsert = (text: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const value = textareaRef.current.value;
      
      let newText = text;
      let newCursorPos = start + text.length;

      if (text === "**" || text === "*") {
        const wrapper = text;
        const selectedText = value.substring(start, end);
        if (selectedText) {
          newText = `${wrapper}${selectedText}${wrapper}`;
          newCursorPos = end + (wrapper.length * 2); 
        } else {
          newText = `${wrapper}${wrapper}`;
          newCursorPos = start + wrapper.length;
        }
      }

      const newValue = value.substring(0, start) + newText + value.substring(end);
      
      setContent(newValue);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
  };

  const updatePostWithId = updatePost.bind(null, post.id);

  return (
    <div className="bg-card/80 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-border shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-medical-100/50 rounded-full blur-3xl -mr-16 -mt-16 -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-100/50 rounded-full blur-3xl -ml-16 -mb-16 -z-10" />

      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
          Edit Post
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Make changes to your masterpiece.
        </p>
      </div>

      <form action={updatePostWithId} className="space-y-8">
        {/* Title Input */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-bold text-foreground ml-1">
            Title
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Type className="w-5 h-5" />
            </div>
            <input
              type="text"
              name="title"
              id="title"
              required
              defaultValue={post.title}
              placeholder="e.g., How I survived Pharmacology II"
              className="block w-full pl-12 pr-4 py-4 bg-secondary/50 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-medium text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Category & Image URL Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-bold text-foreground ml-1">
              Category
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <Tag className="w-5 h-5" />
              </div>
              <select
                name="category"
                id="category"
                defaultValue={post.category || "General"}
                className="block w-full pl-12 pr-4 py-4 bg-secondary/50 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-medium text-foreground appearance-none cursor-pointer"
              >
                <option value="General">General</option>
                <option value="Study Tips">Study Tips</option>
                <option value="Rant">Rant</option>
                <option value="Clinical">Clinical</option>
                <option value="News">News</option>
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label htmlFor="imageUrl" className="block text-sm font-bold text-foreground ml-1">
              Thumbnail URL <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <ImageIcon className="w-5 h-5" />
              </div>
              <input
                type="url"
                name="imageUrl"
                id="imageUrl"
                defaultValue={post.imageUrl || ""}
                placeholder="https://..."
                className="block w-full pl-12 pr-4 py-4 bg-secondary/50 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-medium text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        {/* Content Area with Tabs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="content" className="block text-sm font-bold text-foreground ml-1">
              Content
            </label>
            <div className="flex bg-muted rounded-lg p-1">
              <button
                type="button"
                onClick={() => setActiveTab("write")}
                className={clsx(
                  "px-3 py-1 rounded-md text-sm font-medium transition-all",
                  activeTab === "write" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={clsx(
                  "px-3 py-1 rounded-md text-sm font-medium transition-all",
                  activeTab === "preview" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Preview
              </button>
            </div>
          </div>

          <div className="relative group border-2 border-border/50 rounded-xl bg-secondary/50 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all overflow-hidden min-h-[300px]">
            {activeTab === "write" ? (
              <>
                <EditorToolbar onInsert={handleInsert} />
                <div className="relative">
                  <div className="absolute top-4 left-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <AlignLeft className="w-5 h-5" />
                  </div>
                  <textarea
                    ref={textareaRef}
                    name="content"
                    id="content"
                    required
                    rows={12}
                    placeholder="Write your masterpiece here... (Markdown supported)"
                    className="block w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 transition-all outline-none font-medium text-foreground placeholder:text-muted-foreground resize-y"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <div className="prose prose-slate max-w-none p-6 overflow-y-auto max-h-[500px]">
                {content ? (
                  <ReactMarkdown>{content}</ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground italic">Nothing to preview yet...</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
