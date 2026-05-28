import type { ReportData } from "@/types/template";

const STORAGE_KEY = "pni-ppt-generator:builder-state:v1";
const STORAGE_EVENT = "pni-builder-storage-change";

let cachedRawValue: string | null | undefined;
let cachedSnapshot: StoredBuilderState | null = null;

export type StoredBuilderState = {
  report: ReportData;
  activeSectionKey: string;
  templateFileName: string;
  uploadError: string;
  suggestionMessage: string;
  aiGenerationError: string;
  generationError: string;
  excelImportMessage: string;
  excelImportError: string;
  excelImportWarnings: string[];
};

export function createInitialBuilderState(
  activeSectionKey: string,
  report: ReportData
): StoredBuilderState {
  return {
    report,
    activeSectionKey,
    templateFileName: "",
    uploadError: "",
    suggestionMessage: "",
    aiGenerationError: "",
    generationError: "",
    excelImportMessage: "",
    excelImportError: "",
    excelImportWarnings: [],
  };
}

export function getBuilderSnapshot(): StoredBuilderState | null {
  if (typeof window === "undefined") return null;

  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (rawValue === cachedRawValue) return cachedSnapshot;

  cachedRawValue = rawValue;

  if (!rawValue) {
    cachedSnapshot = null;
    return cachedSnapshot;
  }

  try {
    cachedSnapshot = JSON.parse(rawValue) as StoredBuilderState;
    return cachedSnapshot;
  } catch {
    cachedSnapshot = null;
    return cachedSnapshot;
  }
}

export function getBuilderServerSnapshot() {
  return null;
}

export function subscribeBuilderState(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onStoreChange();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(STORAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(STORAGE_EVENT, onStoreChange);
  };
}

export function saveBuilderState(state: StoredBuilderState) {
  if (typeof window === "undefined") return;

  const rawValue = JSON.stringify(state);
  cachedRawValue = rawValue;
  cachedSnapshot = state;
  window.localStorage.setItem(STORAGE_KEY, rawValue);
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function normalizeBuilderState(
  state: StoredBuilderState | null,
  templateId: string,
  firstSectionKey: string,
  report: ReportData
) {
  const initial = createInitialBuilderState(firstSectionKey, report);
  if (!state || state.report?.templateId !== templateId) return initial;

  return {
    ...initial,
    ...state,
    activeSectionKey: state.activeSectionKey || firstSectionKey,
  };
}
