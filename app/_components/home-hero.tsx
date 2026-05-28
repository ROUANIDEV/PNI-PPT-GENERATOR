import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function HomeHero() {
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Privacy mode is explicit
        </div>

        <div className="space-y-4">
          <h2 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Generate clean PNI PowerPoint reports.
          </h2>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Upload the PNI template, import Excel data or enter values manually,
            review generated charts, edit problems and activities, then export
            the final PowerPoint file.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/builder"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            Start new report
          </Link>
          <Link
            href="/builder"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-semibold transition hover:bg-muted"
          >
            Open builder
          </Link>
        </div>
      </div>

      <Card className="border-border/70 bg-card/95 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold">Privacy mode is explicit</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            Manual editing, Excel import, local suggestions, and PPTX generation
            run in the browser. Gemini is optional and sends report data through
            the app API to Google Gemini.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
