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
  return (
    <Card className="rounded-3xl">
      <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
        <Button
          type="button"
          variant="outline"
          disabled={activeSectionIndex <= 0}
          onClick={onPrevious}
        >
          Section précédente
        </Button>

        <div className="text-sm text-muted-foreground">
          Section {activeSectionIndex + 1} / {sectionsCount}
        </div>

        <Button
          type="button"
          disabled={activeSectionIndex >= sectionsCount - 1}
          onClick={onNext}
        >
          Section suivante
        </Button>
      </CardContent>
    </Card>
  );
}