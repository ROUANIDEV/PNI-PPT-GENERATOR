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
  const updatedValues = {
    ...report.values,
    [sectionKey]: nextValue,
  };

  // Auto-fill centerName (C/S) in other sections when centerInfo is updated
  if (sectionKey === "centerInfo" && typeof nextValue === "object" && nextValue !== null) {
    const centerInfo = nextValue as Record<string, unknown>;
    const centerName = centerInfo.centerName;

    if (typeof centerName === "string" && centerName.trim().length > 0) {
      // Sections that have centerName field that should be auto-filled
      const sectionsToUpdate = ["demographics", "coldChain", "smi2025"];

      sectionsToUpdate.forEach((sectionName) => {
        const sectionData = updatedValues[sectionName];
        
        // Safety checks: ensure we have a valid table structure
        if (!sectionData || typeof sectionData !== "object") {
          return;
        }

        const tableData = sectionData as Record<string, any>;
        
        // Verify rows is an array
        if (!Array.isArray(tableData.rows)) {
          return;
        }

        // Create a new array with updated values
        const updatedRows = tableData.rows.map((row: any) => {
          // Validate row structure
          if (!row || typeof row !== "object" || row.rowKey !== "main") {
            return row;
          }

          // Validate values object
          if (!row.values || typeof row.values !== "object") {
            return row;
          }

          // Return updated row with centerName
          return {
            ...row,
            values: {
              ...row.values,
              centerName,
            },
          };
        });
        
        // Update section with new rows
        updatedValues[sectionName] = {
          ...tableData,
          rows: updatedRows,
        };
      });
    }
  }

  return {
    ...report,
    values: updatedValues,
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
