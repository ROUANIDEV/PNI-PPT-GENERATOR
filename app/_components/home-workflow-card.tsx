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
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          Report Builder Preview
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Open the builder to start filling the PNI report.
        </p>
      </CardHeader>

      <CardContent>
        <div className="mb-5 flex items-center justify-between text-sm">
          <span className="font-semibold">Core workflow available</span>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">Ready</span>
        </div>

        <Progress value={100} />

        <Separator className="my-6" />

        <div className="space-y-3">
          {workflow.map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:shadow-md hover:border-border/80 transition-all duration-200"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-bold text-primary-foreground shadow-sm">
                {index + 1}
              </div>

              <div>
                <p className="font-semibold text-foreground">{item}</p>
                <p className="text-sm text-muted-foreground">
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
