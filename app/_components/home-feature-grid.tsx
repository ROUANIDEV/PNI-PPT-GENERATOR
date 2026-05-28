import {
  BarChart3,
  BrainCircuit,
  FileSpreadsheet,
  FileUp,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "PPTX template",
    description: "Use the official PNI PowerPoint template as the base file.",
    icon: FileUp,
  },
  {
    title: "Excel import",
    description: "Download the Excel template or import completed PNI data.",
    icon: FileSpreadsheet,
  },
  {
    title: "Chart filling",
    description: "Fill PowerPoint tables and chart data from report values.",
    icon: BarChart3,
  },
  {
    title: "Smart suggestions",
    description: "Generate local suggestions or optionally use Gemini AI.",
    icon: BrainCircuit,
  },
];

export function HomeFeatureGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {features.map((feature) => {
        const Icon = feature.icon;

        return (
          <Card key={feature.title} className="rounded-2xl hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 mb-4 w-fit">
                <Icon className="size-5 text-primary" />
              </div>
              <p className="font-bold text-foreground">{feature.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
