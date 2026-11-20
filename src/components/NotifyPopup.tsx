"use client";

import { useActionState, useEffect, useRef, useState, type AnimationEvent, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import type { NotifyPopupData } from "@/lib/strapi";
import { subscribe, type SubscribeState } from "@/app/actions/subscribe";
import styles from "./NotifyPopup.module.css";

type Props = {
  data: NotifyPopupData;
  onClose: () => void; // the parent removes the popup when this is called
};


export default function NotifyPopup({ data, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);

  // When the popup appears: open the <dialog> as a "modal" and stop the page from scrolling.
  // When it disappears: undo both.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal(); 
    // The browser would focus the e-mail field
    boxRef.current?.focus();

    // Stop the page scrolling WITHOUT hiding the scrollbar
    const insideScrollableDialog = (target: EventTarget | null) =>
      dialog.contains(target as Node) && dialog.scrollHeight > dialog.clientHeight;
    const blockScroll = (event: Event) => {
      if (!insideScrollableDialog(event.target)) event.preventDefault();
    };
    const SCROLL_KEYS = [" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"];
    const blockKeys = (event: KeyboardEvent) => {
      const typing = (event.target as HTMLElement).closest("input, button"); 
      if (SCROLL_KEYS.includes(event.key) && !typing) event.preventDefault();
    };
    
    window.addEventListener("wheel", blockScroll, { passive: false });
    window.addEventListener("touchmove", blockScroll, { passive: false });
    window.addEventListener("keydown", blockKeys);

    return () => {
      if (dialog.open) dialog.close();
      window.removeEventListener("wheel", blockScroll);
      window.removeEventListener("touchmove", blockScroll);
      window.removeEventListener("keydown", blockKeys);
    };
  }, []);

  // Close button, Esc key and clicks on the dark area
  const requestClose = () => {
  
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return onClose();
    setClosing(true); 
  };

 
  const handleAnimationEnd = (event: AnimationEvent<HTMLDialogElement>) => {
    if (closing && event.target === event.currentTarget && !event.pseudoElement) onClose();
  };


  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) requestClose();
  };


  return createPortal(
    <dialog
      ref={dialogRef}
      className={`${styles.dialog} ${closing ? styles.closing : ""}`}
      aria-labelledby="notify-heading"
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={handleClick}
      onAnimationEnd={handleAnimationEnd}
    >
      <div ref={boxRef} className={styles.box} tabIndex={-1}>
        <h2 id="notify-heading" className={styles.heading}>
          {data.heading}
        </h2>
        {/* white-space: pre-line in the CSS keeps the Enter-key line break from Strapi */}
        <p className={styles.text}>{data.text}</p>

        <SignupForm data={data} />

        <button type="button" className={styles.close} onClick={requestClose}>
          {data.closeLabel}
        </button>
      </div>
    </dialog>,
    document.body
  );
}

// ---------- e-mail form ----------
function SignupForm({ data }: { data: NotifyPopupData }) {
  const [state, action, pending] = useActionState<SubscribeState, FormData>(subscribe, { status: "idle" });

  if (state.status === "success") {
    return (
      <p className={styles.success} role="status">
        {data.successMessage}
      </p>
    );
  }

  const message = {
    idle: "",
    success: "",
    duplicate: data.duplicateMessage,
    invalid: "Please enter a valid e-mail address.",
    error: "Something went wrong. Please try again.",
  }[state.status];

  return (
    <form action={action} className={styles.form}>
      <input
        type="email" 
        name="email" 
        required
        autoComplete="email"
        placeholder={data.emailPlaceholder}
        aria-label={data.emailPlaceholder}
        className={styles.input}
      />

      <p className={styles.message} aria-live="polite">
        {message}
      </p>

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? "Sending…" : data.buttonLabel}
        <span className={styles.dot} aria-hidden="true">
          •
        </span>
      </button>
    </form>
  );
}
