"use client";

import { toast } from "sonner";

const EMAIL = "dawsonxiong@gmail.com";

export function CopyEmailButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(EMAIL);
          toast.success("Email copied");
        } catch {
          toast.error("Couldn’t copy email");
        }
      }}
    >
      Email
    </button>
  );
}
