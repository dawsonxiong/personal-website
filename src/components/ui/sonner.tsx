"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          // The same frosted glass as the carousel arrows and dialog close button.
          "--normal-bg": "rgb(246 249 251 / 82%)",
          "--normal-text": "var(--pool-ink)",
          "--normal-border": "rgb(255 255 255 / 60%)",
          "--border-radius": "16px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast font-medium shadow-[0_4px_14px_#123e6026] backdrop-blur-[8px]",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
