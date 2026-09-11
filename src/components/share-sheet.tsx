"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Share2, X } from "lucide-react";

export interface ShareDraft {
  title: string;
  text: string;
  url: string;
  supportsNative: boolean;
}

export function ShareSheet({
  draft,
  onClose,
}: {
  draft: ShareDraft;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(draft.text);
      setMessage("הרעיון והקישור הועתקו.");
    } catch {
      setMessage("אפשר לסמן את הטקסט ולהעתיק ידנית.");
    }
  }
  async function nativeShare() {
    try {
      await navigator.share({
        title: draft.title,
        text: draft.text,
        url: draft.url,
      });
      onClose();
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError"))
        setMessage("השיתוף לא נפתח. אפשר להעתיק את הרעיון מכאן.");
    }
  }
  return (
    <dialog
      ref={dialogRef}
      className="share-sheet"
      aria-labelledby="share-heading"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="share-sheet-inner">
        <div className="share-sheet-header">
          <h2 id="share-heading">רעיון טוב עובר הלאה.</h2>
          <button
            className="icon-button"
            aria-label="סגירת חלונית השיתוף"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        <p className="share-title">{draft.title}</p>
        <div className="share-sheet-actions">
          <button className="primary-button" onClick={copy}>
            <Copy size={17} />
            העתקת הרעיון והקישור
          </button>
          {draft.supportsNative && (
            <button className="secondary-button" onClick={nativeShare}>
              <Share2 size={17} />
              שיתוף דרך אפליקציה
            </button>
          )}
        </div>
        <details>
          <summary>הטקסט לשיתוף · אפשר גם להעתיק ידנית</summary>
          <textarea
            aria-label="טקסט לשיתוף"
            value={draft.text}
            readOnly
            onFocus={(event) => event.target.select()}
          />
        </details>
        {message && (
          <p className="share-message" role="status">
            <Check size={16} />
            {message}
          </p>
        )}
      </div>
    </dialog>
  );
}
