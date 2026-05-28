"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

type FileDropZoneProps = {
  title: string;
  description: string;
  accept: string;
  buttonLabel: string;
  disabled?: boolean;
  onFile: (file: File | undefined) => void;
};

export function FileDropZone({
  title,
  description,
  accept,
  buttonLabel,
  disabled,
  onFile,
}: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function openPicker() {
    if (!disabled) inputRef.current?.click();
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (!disabled) onFile(event.dataTransfer.files?.[0]);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openPicker}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") openPicker();
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`group rounded-3xl border border-dashed p-5 text-center transition sm:p-6 ${
        isDragging
          ? "border-primary bg-primary/10"
          : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-background shadow-sm">
        <UploadCloud className="size-6 text-primary" />
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        className="mt-4 rounded-2xl"
        onClick={(event) => {
          event.stopPropagation();
          openPicker();
        }}
      >
        {buttonLabel}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => onFile(event.target.files?.[0])}
      />
    </div>
  );
}
