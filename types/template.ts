export type InputType = "text" | "number" | "date" | "textarea";

export type SectionType =
  | "form"
  | "table"
  | "matrix"
  | "list"
  | "chart";

export type ChartType = "line" | "bar";

export type PptxLocation = {
  slideIndex: number;
  tableIndex?: number;
  chartIndex?: number;
  columnIndex?: number;
};

export type TemplateDefinition = {
  id: string;
  name: string;
  language: "fr";
  sections: TemplateSection[];
};

export type TemplateSection =
  | FormSection
  | TableSection
  | MatrixSection
  | ListSection
  | ChartSection;

export type BaseSection = {
  key: string;
  title: string;
  description?: string;
  type: SectionType;
  order: number;
  pptx?: PptxLocation;
};

export type TemplateField = {
  key: string;
  label: string;
  inputType: InputType;
  required?: boolean;
  readonly?: boolean;
  defaultValue?: string | number;
};

export type FormSection = BaseSection & {
  type: "form";
  fields: TemplateField[];
};

export type TemplateRow = {
  key: string;
  label: string;
};

export type TemplateColumn = {
  key: string;
  label: string;
  inputType: InputType;
  readonly?: boolean;
};

export type TableSection = BaseSection & {
  type: "table";
  rowHeader: string;
  allowCustomRows: boolean;
  autoCalculateRate?: boolean;
  rows: TemplateRow[];
  columns: TemplateColumn[];
};

export type MatrixSection = BaseSection & {
  type: "matrix";
  rows: TemplateRow[];
  columns: TemplateRow[];
};

export type ListSection = BaseSection & {
  type: "list";
  itemLabel: string;
  aiGenerated?: boolean;
};

export type ChartSection = BaseSection & {
  type: "chart";
  chartType: ChartType;
  sourceSectionKey: string;
};

export type ReportData = {
  templateId: string;
  values: Record<string, unknown>;
};