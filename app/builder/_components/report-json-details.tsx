import type { ReportData } from "@/types/template";

type ReportJsonDetailsProps = {
  report: ReportData;
};

export function ReportJsonDetails({ report }: ReportJsonDetailsProps) {
  return (
    <details className="rounded-2xl border bg-card p-5 text-card-foreground">
      <summary className="cursor-pointer font-semibold">
        Voir les données JSON actuelles
      </summary>

      <pre className="mt-4 max-h-[500px] overflow-auto rounded-xl border bg-muted p-4 text-xs text-muted-foreground">
        {JSON.stringify(report, null, 2)}
      </pre>
    </details>
  );
}