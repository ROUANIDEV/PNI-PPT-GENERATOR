import {
  Activity,
  BarChart3,
  BrainCircuit,
  FileSpreadsheet,
  FileUp,
  Presentation,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    title: "Upload PPTX Template",
    description:
      "Use the official PNI PowerPoint template as the base file.",
    icon: FileUp,
  },
  {
    title: "Enter PNI Data",
    description:
      "Fill demographic, SMI, vaccination, stock, and monthly follow-up data.",
    icon: Activity,
  },
  {
    title: "Generate Charts",
    description:
      "Create vaccination coverage graphs directly from the entered data.",
    icon: BarChart3,
  },
  {
    title: "AI Problems & Activities",
    description:
      "Generate problems identified and planned activities, then edit them manually.",
    icon: BrainCircuit,
  },
];

const workflow = [
  "Upload template",
  "Enter data",
  "Review charts",
  "Generate AI text",
  "Export PPTX",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0f2fe,_transparent_35%),linear-gradient(to_bottom,_#ffffff,_#f8fafc)]">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-300">
              <Presentation className="size-5" />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                PNI PPT Generator
              </h1>
              <p className="text-sm text-muted-foreground">
                Vaccination report automation
              </p>
            </div>
          </div>

          <Badge variant="secondary" className="rounded-full px-4 py-2">
            Mini Project
          </Badge>
        </header>

        <div className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Badge className="mb-5 rounded-full px-4 py-2">
              <Sparkles className="mr-2 size-4" />
              Next.js + shadcn/ui + PPTX generation
            </Badge>

            <h2 className="max-w-4xl text-5xl font-black tracking-tight text-slate-950 md:text-6xl">
              Generate professional PNI PowerPoint reports from simple data
              entry.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Upload the PNI template, enter vaccination data manually, review
              generated charts, edit AI-generated problems and activities, then
              export the final PowerPoint file.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="rounded-2xl px-6" asChild>
  <Link href="/builder">
    Start new report
  </Link>
</Button>

<Button
  size="lg"
  variant="outline"
  className="rounded-2xl bg-white px-6"
  asChild
>
  <Link href="/builder">
    Upload template
  </Link>
</Button>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <Card
                    key={feature.title}
                    className="rounded-3xl border-slate-200 bg-white/80 shadow-sm backdrop-blur"
                  >
                    <CardHeader className="space-y-3 pb-3">
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-100">
                        <Icon className="size-5 text-slate-900" />
                      </div>

                      <CardTitle className="text-sm">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p className="text-xs leading-5 text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="overflow-hidden rounded-[2rem] border-slate-200 bg-white/90 shadow-2xl shadow-slate-200 backdrop-blur">
            <CardHeader className="border-b bg-slate-950 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    Report Builder
                  </CardTitle>
                  <p className="mt-2 text-sm text-slate-300">
                    Current workflow preview
                  </p>
                </div>

                <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10">
                  <ShieldCheck className="size-6" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              <div>
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="font-medium">Project completion</span>
                  <span className="text-muted-foreground">0%</span>
                </div>

                <Progress value={0} />
              </div>

              <Separator />

              <div className="space-y-4">
                {workflow.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-2xl border bg-slate-50 p-4"
                  >
                    <div className="flex size-9 items-center justify-center rounded-full bg-white text-sm font-bold shadow-sm">
                      {index + 1}
                    </div>

                    <div>
                      <p className="font-medium">{item}</p>
                      <p className="text-sm text-muted-foreground">
                        Step {index + 1} of the report generation process
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="rounded-3xl bg-slate-100 p-5">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="size-5 text-slate-700" />
                  <p className="font-medium">
                    Excel import will be added after manual data entry.
                  </p>
                </div>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  First we build the form-based version. Then we add Excel
                  import, AI text generation, and final PPTX export.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}