"use client";

import { useState } from "react";
import { CopyIcon } from "@/components/icons";

type ContactActionsProps = {
  email: string;
};

export function ContactActions({ email }: ContactActionsProps) {
  const [status, setStatus] = useState("");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("Email copied");
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = email;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      const copied = document.execCommand("copy");
      textArea.remove();
      setStatus(copied ? "Email copied" : "Copy failed — select the email instead");
    }

    window.setTimeout(() => setStatus(""), 2400);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href={`mailto:${email}`} className="button button--primary" data-analytics="contact-email">
        Write an email
      </a>
      <button type="button" className="button button--secondary" onClick={copyEmail} data-testid="copy-email">
        <CopyIcon className="size-4" /> Copy email
      </button>
      <span className="min-h-5 text-xs text-[var(--muted)]" role="status" aria-live="polite" data-testid="copy-status">
        {status}
      </span>
    </div>
  );
}
