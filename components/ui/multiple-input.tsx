"use client";

import * as React from "react";

interface TagInputProps {
  defaultValue?: string[];
  placeholder?: string;
  onChange?: (tags: string[]) => void;
}

export function TagInput({
  defaultValue = ["Next.js"],
  placeholder = "Type and press Enter…",
  onChange,
}: TagInputProps) {
  const [tags, setTags] = React.useState(defaultValue);
  const [input, setInput] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const addTag = (value: string): void => {
    const trimmed = value.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    const next = [...tags, trimmed];
    setTags(next);
    onChange?.(next);
    setInput("");
  };

  const removeTag = (tag: string): void => {
    const next = tags.filter((t) => t !== tag);
    setTags(next);
    onChange?.(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <>
      <style>{`
    
      

        .tag-input-wrapper {
          width: 100%;
        
        }

        .tag-input-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 8px;
        }

        .tag-input-field {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-items: center;
          padding: 10px 12px;
          background: #FFFFFF1A;
          border: 1.5px solid #FFFFFF4D;
          border-radius: 12px;
          cursor: text;
          transition: border-color 0.18s, box-shadow 0.18s;
          min-height: 48px;
        }

        .tag-input-field.focused {
          border-color: #1a1a1a;
          box-shadow: 0 0 0 3px rgba(26,26,26,0.06);
          outline: none;
        }

        .chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 10px 6px 16px;
          background: #a2a1a1ff;
          color: #f0ece3;
          border-radius: 99px;
          font-size: 0.8rem;
          font-weight: 400;
          line-height: 1;
          white-space: nowrap;
          animation: chip-in 0.15s ease;
        }

        @keyframes chip-in {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }

        .chip-remove {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: #c70b0bff;
          cursor: pointer;
          padding: 0;
          font-size: 12px;
          line-height: 1;
          transition: background 0.15s, color 0.15s;
        }

        .chip-remove:hover {
          background: #333;
          color: #fff;
        }

        .tag-input-text {
          flex: 1;
          min-width: 120px;
          border: none;
          outline: none;
          background: transparent;
          font-family: inherit;
          font-size: 0.88rem;
          color: #ffffffff;
          padding: 2px 0;
        }

        .tag-input-text::placeholder { color: #bbb; }

        .tag-input-hint {
          margin-top: 8px;
          font-size: 0.75rem;
          color: #bbb;
          letter-spacing: 0.02em;
        }

        .tag-count {
          margin-top: 16px;
          font-size: 0.78rem;
          color: #999;
        }
        .tag-count span {
          font-weight: 500;
          color: #1a1a1a;
        }
      `}</style>

      <div className="tag-input-root">
        <div className="tag-input-wrapper">
          <div
            ref={containerRef}
            className={`tag-input-field${focused ? " focused" : ""}`}
            onClick={() => inputRef.current?.focus()}
          >
            {tags.map((tag) => (
              <span key={tag} className="chip">
                {tag}
                <button
                  className="chip-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag);
                  }}
                  tabIndex={-1}
                  aria-label={`Remove ${tag}`}
                >
                  ✕
                </button>
              </span>
            ))}

            <input
              ref={inputRef}
              className="tag-input-text"
              value={input}
              placeholder={tags.length === 0 ? placeholder : ""}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                setFocused(false);
                // also add on blur if there's something typed
                if (input.trim()) addTag(input);
              }}
            />
          </div>

          <p className="tag-input-hint">
            Press Enter or Tab away to add a tag · Backspace to remove last
          </p>
        </div>
      </div>
    </>
  );
}

export default TagInput;
