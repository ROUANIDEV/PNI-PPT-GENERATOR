import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function HomeHero() {
  return (
    <div>

      <h2 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
        Generate clean PNI PowerPoint reports.
      </h2>

      <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
        Upload the PNI template, import Excel data or enter values manually,
        review generated charts, edit problems and activities, then export the
        final PowerPoint file.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/builder"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          Start new report
        </Link>

        <Link
          href="/builder"
          className="inline-flex h-11 items-center justify-center rounded-xl border bg-background px-6 text-sm font-semibold shadow-sm transition hover:bg-accent hover:text-accent-foreground"
        >
          Open builder
        </Link>
      </div>

      <Card className="mt-8 max-w-2xl rounded-2xl">
        <CardContent className="flex gap-4 p-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <ShieldCheck className="size-5" />
          </div>

          <div>
            <p className="font-bold">Privacy mode is explicit</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Manual editing, Excel import, local suggestions, and PPTX
              generation run in the browser. Gemini is optional and sends
              report data through the app API to Google Gemini.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}