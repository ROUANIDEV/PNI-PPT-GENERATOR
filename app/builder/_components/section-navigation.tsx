import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type SectionNavigationProps = {
  activeSectionIndex: number;
  sectionsCount: number;
  onPrevious: () => void;
  onNext: () => void;
};

export function SectionNavigation({
  activeSectionIndex,
  sectionsCount,
  onPrevious,
  onNext,
}: SectionNavigationProps) {
  const isFirst = activeSectionIndex <= 0;
  const isLast = activeSectionIndex >= sectionsCount - 1;

  return (
    <Card className="rounded-2xl sm:rounded-3xl border-border/70 shadow-sm">
      <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-4">
        <p className="text-center text-xs sm:text-sm font-medium text-muted-foreground">
          Section {activeSectionIndex + 1} of {sectionsCount}
        </p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <Button
            type="button"
            variant="outline"
            className="h-9 sm:h-10 md:h-11 min-w-0 rounded-lg sm:rounded-xl md:rounded-2xl px-2 sm:px-3 md:px-4 text-[10px] sm:text-xs md:text-sm sm:w-auto sm:justify-self-start focus-visible:ring-2 focus-visible:ring-ring"
            disabled={isFirst}
            onClick={onPrevious}
            aria-label="Previous section"
          >
            <ArrowLeft className="mr-1 sm:mr-1.5 md:mr-2 size-3 sm:size-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <span className="hidden text-center text-[10px] sm:text-xs text-muted-foreground sm:block">
            Navigate sections
          </span>

          <Button
            type="button"
            className="h-9 sm:h-10 md:h-11 min-w-0 rounded-lg sm:rounded-xl md:rounded-2xl px-2 sm:px-3 md:px-4 text-[10px] sm:text-xs md:text-sm sm:w-auto sm:justify-self-end focus-visible:ring-2 focus-visible:ring-ring"
            disabled={isLast}
            onClick={onNext}
            aria-label="Next section"
          >
            <span className="hidden sm:inline">Next</span>
            <ArrowRight className="ml-1 sm:ml-1.5 md:ml-2 size-3 sm:size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
