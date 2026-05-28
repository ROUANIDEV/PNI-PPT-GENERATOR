import type { ReportData } from "@/types/template";

export type GeneratedPlan = {
  problems: unknown[];
  activities: unknown[];
};

export function applySectionValue(
  report: ReportData,
  sectionKey: string,
  nextValue: unknown
): ReportData {
  return {
    ...report,
    values: {
      ...report.values,
      [sectionKey]: nextValue,
    },
  };
}

export function applyGeneratedPlan(
  report: ReportData,
  plan: GeneratedPlan
): ReportData {
  return {
    ...report,
    values: {
      ...report.values,
      problems: {
        items: plan.problems,
      },
      activities: {
        items: plan.activities,
      },
    },
  };
}