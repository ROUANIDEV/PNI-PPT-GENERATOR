import { CheckCircle2, FileUp, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFileSize } from "../_utils/format-file-size";
import { FileDropZone } from "./file-drop-zone";

type TemplateUploadCardProps = {
  templateFile: File | null;
  uploadError: string;
  onUpload: (file: File | undefined) => void;
};

export function TemplateUploadCard({
  templateFile,
  uploadError,
  onUpload,
}: TemplateUploadCardProps) {
  return (
    <Card className="overflow-hidden rounded-2xl sm:rounded-3xl border-border/70 shadow-sm">
      <CardHeader className="space-y-1.5 sm:space-y-2 bg-muted/20 p-3 sm:p-4 md:p-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <StepBadge>1</StepBadge>
          <CardTitle className="text-base sm:text-lg md:text-xl">Upload PowerPoint Template</CardTitle>
        </div>
        <p className="text-xs sm:text-sm leading-5 sm:leading-6 text-muted-foreground">
          Select the empty PNI PowerPoint file. The file stays in your browser until final generation.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6">
        <FileDropZone
          title="Drop PPTX template here"
          description="Drag the file into this zone or click to open file selector."
          accept=".pptx"
          buttonLabel="Select file"
          onFile={onUpload}
        />
        {templateFile ? <LoadedTemplate file={templateFile} /> : <EmptyState />}
        {uploadError ? (
          <div className="rounded-lg sm:rounded-xl border border-destructive/30 bg-destructive/10 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-destructive animate-pulse">
            <p className="font-medium">Error: {uploadError}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function StepBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-lg sm:rounded-2xl bg-primary text-xs sm:text-sm font-bold text-primary-foreground shadow-sm">
      {children}
    </span>
  );
}

function LoadedTemplate({ file }: { file: File }) {
  return (
    <div className="flex items-start gap-2 sm:gap-3 rounded-lg sm:rounded-2xl border border-green-500/30 bg-green-500/10 p-3 sm:p-4 animate-fade-in">
      <CheckCircle2 className="mt-0.5 size-4 sm:size-5 shrink-0 text-green-600" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-xs sm:text-sm text-green-700">Template loaded</p>
        <p className="truncate text-xs text-muted-foreground">{file.name}</p>
        <p className="text-[10px] text-muted-foreground">{formatFileSize(file.size)}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex items-start gap-2 sm:gap-3 rounded-lg sm:rounded-2xl border border-border/60 bg-muted/30 p-3 sm:p-4 transition-colors hover:border-border/80 hover:bg-muted/50">
      <FileUp className="mt-0.5 size-4 sm:size-5 shrink-0 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-xs sm:text-sm">No template loaded</p>
        <p className="text-[10px] sm:text-xs leading-5 sm:leading-6 text-muted-foreground">
          Upload the PowerPoint template before final generation.
        </p>
      </div>
      <Lock className="size-3.5 sm:size-4 shrink-0 text-muted-foreground/70" />
    </div>
  );
}
