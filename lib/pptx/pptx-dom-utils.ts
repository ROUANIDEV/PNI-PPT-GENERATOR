const A_NS = "http://schemas.openxmlformats.org/drawingml/2006/main";

type TextRunOptions = {
  bold?: boolean;
};

export function getSlideXmlPath(slideIndex: number) {
  return `ppt/slides/slide${slideIndex + 1}.xml`;
}

export function parseXml(xml: string) {
  return new DOMParser().parseFromString(xml, "application/xml");
}

export function serializeXml(document: Document) {
  return new XMLSerializer().serializeToString(document);
}

function getElements(parent: Element | Document, tagName: string) {
  return Array.from(parent.getElementsByTagName(tagName));
}

function getFirstElement(parent: Element | Document, tagName: string) {
  return getElements(parent, tagName)[0] ?? null;
}

function applyRunOptions(
  document: Document,
  run: Element,
  sourceRun?: Element | null,
  options?: TextRunOptions
) {
  const sourceRunProperties = sourceRun?.getElementsByTagName("a:rPr")[0];
  let runProperties: Element | null = null;

  if (sourceRunProperties) {
    runProperties = sourceRunProperties.cloneNode(true) as Element;
  } else if (options?.bold) {
    runProperties = document.createElementNS(A_NS, "a:rPr");
  }

  if (runProperties && options?.bold) {
    runProperties.setAttribute("b", "1");
  }

  if (runProperties) {
    run.appendChild(runProperties);
  }
}

function createTextRun(
  document: Document,
  text: string,
  sourceRun?: Element | null,
  options?: TextRunOptions
) {
  const run = document.createElementNS(A_NS, "a:r");

  applyRunOptions(document, run, sourceRun, options);

  const textElement = document.createElementNS(A_NS, "a:t");
  textElement.textContent = text;

  run.appendChild(textElement);

  return run;
}

function setTextBodyText(
  textBody: Element,
  text: string,
  options?: TextRunOptions
) {
  const document = textBody.ownerDocument;

  const oldParagraphs = Array.from(textBody.children).filter((child) => {
    return child.tagName === "a:p";
  });

  const firstParagraph = oldParagraphs[0] ?? null;
  const firstRun = firstParagraph?.getElementsByTagName("a:r")[0] ?? null;
  const firstParagraphProperties =
    firstParagraph?.getElementsByTagName("a:pPr")[0] ?? null;

  for (const paragraph of oldParagraphs) {
    textBody.removeChild(paragraph);
  }

  const lines = text.split("\n");

  for (const line of lines) {
    const paragraph = document.createElementNS(A_NS, "a:p");

    if (firstParagraphProperties) {
      paragraph.appendChild(firstParagraphProperties.cloneNode(true));
    }

    paragraph.appendChild(createTextRun(document, line, firstRun, options));
    textBody.appendChild(paragraph);
  }
}

export function setShapeTextByExistingText(
  slideXml: string,
  existingText: string,
  newText: string,
  options?: TextRunOptions
) {
  const document = parseXml(slideXml);
  const shapes = getElements(document, "p:sp");

  for (const shape of shapes) {
    const textBody = getFirstElement(shape, "p:txBody");

    if (!textBody) {
      continue;
    }

    const textElements = getElements(textBody, "a:t");

    const fullText = textElements
      .map((item) => item.textContent ?? "")
      .join("");

    if (fullText.includes(existingText)) {
      setTextBodyText(textBody, newText, options);

      return serializeXml(document);
    }
  }

  return slideXml;
}

export function setTableCellText(
  slideXml: string,
  tableIndex: number,
  rowIndex: number,
  columnIndex: number,
  text: string,
  options?: TextRunOptions
) {
  const document = parseXml(slideXml);
  const tables = getElements(document, "a:tbl");
  const table = tables[tableIndex];

  if (!table) {
    return slideXml;
  }

  const rows = Array.from(table.children).filter((child) => {
    return child.tagName === "a:tr";
  });

  const row = rows[rowIndex];

  if (!row) {
    return slideXml;
  }

  const cells = Array.from(row.children).filter((child) => {
    return child.tagName === "a:tc";
  });

  const cell = cells[columnIndex];

  if (!cell) {
    return slideXml;
  }

  let textBody = getFirstElement(cell, "a:txBody");

  if (!textBody) {
    textBody = document.createElementNS(A_NS, "a:txBody");
    cell.appendChild(textBody);
  }

  setTextBodyText(textBody, text, options);

  return serializeXml(document);
}

export function setTableRowValues(
  slideXml: string,
  tableIndex: number,
  rowIndex: number,
  startColumnIndex: number,
  values: string[]
) {
  let nextXml = slideXml;

  values.forEach((value, valueIndex) => {
    nextXml = setTableCellText(
      nextXml,
      tableIndex,
      rowIndex,
      startColumnIndex + valueIndex,
      value
    );
  });

  return nextXml;
}

export function bulletListToText(items: string[]) {
  return items
    .filter((item) => item.trim().length > 0)
    .map((item) => `• ${item}`)
    .join("\n");
}