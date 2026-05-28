import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function HomeHero() {
  return (
    <section className="space-y-6 sm:space-y-8">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm text-muted-foreground shadow-sm">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          Privacy mode is explicit
        </div>

        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-balance">
            Generate clean PNI PowerPoint reports.
          </h2>
          <p className="max-w-2xl text-sm leading-6 sm:text-base sm:leading-7 md:text-lg text-muted-foreground">
            Upload the PNI template, import Excel data or enter values manually,
            review generated charts, edit problems and activities, then export
            the final PowerPoint file.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Link
            href="/builder"
            className="inline-flex h-10 sm:h-11 items-center justify-center rounded-xl bg-primary px-4 sm:px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Start new report
          </Link>
          <Link
            href="/builder"
            className="inline-flex h-10 sm:h-11 items-center justify-center rounded-xl border border-border bg-background px-4 sm:px-6 text-sm font-semibold transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Open builder
          </Link>
        </div>
      </div>

      <Card className="border-border/70 bg-card/95 shadow-sm">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Privacy mode is explicit</h3>
            <p className="mt-1 text-xs sm:text-sm leading-6 text-muted-foreground">
              Manual editing, Excel import, local suggestions, and PPTX generation
              run in the browser. Gemini is optional and sends report data through
              the app API to Google Gemini.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
