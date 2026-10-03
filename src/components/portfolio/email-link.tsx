"use client";

import { toast } from "sonner";

const EMAIL = "dawsonxiong@gmail.com";
const SUBJECT = "Hey Dawson";
const BODY = "I thought your site was really cool... by the way my name is ";

const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`;

export function EmailLink({ className }: { className?: string }) {
  return (
    <a
      className={className}
      href={MAILTO}
      onClick={async () => {
        // Also copy the address, for visitors without a mail app set up.
        try {
          await navigator.clipboard.writeText(EMAIL);
          toast.success("Email copied");
        } catch {}
      }}
    >
      Email
    </a>
  );
}
