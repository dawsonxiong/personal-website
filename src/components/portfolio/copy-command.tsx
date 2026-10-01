"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckIcon, ClipboardDocumentIcon } from "@/components/icons";

export function CopyCommand({ command, className }: { command: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className={className}>
      <code>{command}</code>
      <button
        type="button"
        aria-label="Copy install command"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(command);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          } catch {
            toast.error("Couldn’t copy command");
          }
        }}
      >
        {copied ? <CheckIcon aria-hidden="true" /> : <ClipboardDocumentIcon aria-hidden="true" />}
      </button>
    </div>
  );
}
