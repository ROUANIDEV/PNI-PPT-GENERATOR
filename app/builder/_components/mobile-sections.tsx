"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileSections({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 p-3 backdrop-blur lg:hidden">
      <div className="mb-3 flex justify-end">
        <Button size="icon" variant="outline" className="rounded-2xl" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>
      {children}
    </div>
  );
}
