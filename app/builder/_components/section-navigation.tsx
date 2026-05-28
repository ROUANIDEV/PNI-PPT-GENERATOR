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
    <Card className="rounded-3xl border-border/70 shadow-sm">
      <CardContent className="space-y-3 p-3 sm:p-4">
        <p className="text-center text-sm font-medium text-muted-foreground">
          Section {activeSectionIndex + 1} / {sectionsCount}
        </p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <Button
            type="button"
            variant="outline"
            className="h-11 min-w-0 rounded-2xl px-3 text-xs sm:w-auto sm:justify-self-start sm:px-4 sm:text-sm"
            disabled={isFirst}
            onClick={onPrevious}
          >
            <ArrowLeft className="mr-1.5 size-4 sm:mr-2" />
            Précédent
          </Button>

          <span className="hidden text-center text-xs text-muted-foreground sm:block">
            Naviguer entre les sections
          </span>

          <Button
            type="button"
            className="h-11 min-w-0 rounded-2xl px-3 text-xs sm:w-auto sm:justify-self-end sm:px-4 sm:text-sm"
            disabled={isLast}
            onClick={onNext}
          >
            Suivant
            <ArrowRight className="ml-1.5 size-4 sm:ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
