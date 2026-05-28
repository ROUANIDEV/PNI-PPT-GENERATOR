import { Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const workflow = [
  "Upload PPTX template",
  "Import Excel or enter data manually",
  "Review and edit report sections",
  "Generate local or Gemini suggestions",
  "Export final PPTX",
];

export function HomeWorkflowCard() {
  return (
    <Card className="rounded-2xl h-fit sticky top-6">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Sparkles className="size-5 text-primary shrink-0" />
          Report Builder Preview
        </CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Open the builder to start filling the PNI report.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
          <span className="font-semibold">Core workflow available</span>
          <span className="px-2 sm:px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold whitespace-nowrap">Ready</span>
        </div>

        <Progress value={100} className="h-1.5" />

        <Separator className="my-4 sm:my-6" />

        <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
          {workflow.map((item, index) => (
            <div
              key={item}
              className="flex items-start sm:items-center gap-2 sm:gap-3 rounded-xl border border-border bg-muted/30 p-2.5 sm:p-3 hover:shadow-md hover:border-primary/40 hover:bg-muted/50 transition-all duration-200 group"
            >
              <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs sm:text-sm font-bold text-primary-foreground shadow-sm group-hover:shadow-md transition-shadow">
                {index + 1}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-xs sm:text-sm text-foreground line-clamp-1">{item}</p>
                <p className="text-xs text-muted-foreground">
                  Step {index + 1} of 5
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
