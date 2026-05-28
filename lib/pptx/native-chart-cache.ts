type ChartSeries = {
  name: string;
  values: number[];
};

const C_NS = "http://schemas.openxmlformats.org/drawingml/2006/chart";

function parseXml(xml: string) {
  return new DOMParser().parseFromString(xml, "application/xml");
}

function serializeXml(document: Document) {
  return new XMLSerializer().serializeToString(document);
}

function getChildrenByTag(parent: Element, tagName: string) {
  return Array.from(parent.children).filter((child) => {
    return child.tagName === tagName;
  });
}

function getFirstChildByTag(parent: Element, tagName: string) {
  return getChildrenByTag(parent, tagName)[0] ?? null;
}

function clearPoints(cache: Element) {
  for (const point of getChildrenByTag(cache, "c:pt")) {
    cache.removeChild(point);
  }
}

function setPointCount(document: Document, cache: Element, count: number) {
  let pointCount = getFirstChildByTag(cache, "c:ptCount");

  if (!pointCount) {
    pointCount = document.createElementNS(C_NS, "c:ptCount");
    cache.prepend(pointCount);
  }

  pointCount.setAttribute("val", String(count));
}

function addTextPoint(
  document: Document,
  cache: Element,
  index: number,
  value: string
) {
  const point = document.createElementNS(C_NS, "c:pt");
  point.setAttribute("idx", String(index));

  const textValue = document.createElementNS(C_NS, "c:v");
  textValue.textContent = value;

  point.appendChild(textValue);
  cache.appendChild(point);
}

function addNumberPoint(
  document: Document,
  cache: Element,
  index: number,
  value: number
) {
  const point = document.createElementNS(C_NS, "c:pt");
  point.setAttribute("idx", String(index));

  const numberValue = document.createElementNS(C_NS, "c:v");
  numberValue.textContent = String(value);

  point.appendChild(numberValue);
  cache.appendChild(point);
}

function updateStringCache(cache: Element, values: string[]) {
  const document = cache.ownerDocument;

  setPointCount(document, cache, values.length);
  clearPoints(cache);

  values.forEach((value, index) => {
    addTextPoint(document, cache, index, value);
  });
}

function updateNumberCache(cache: Element, values: number[]) {
  const document = cache.ownerDocument;

  setPointCount(document, cache, values.length);
  clearPoints(cache);

  values.forEach((value, index) => {
    addNumberPoint(document, cache, index, value);
  });
}

function updateSeriesName(seriesElement: Element, name: string) {
  const tx = getFirstChildByTag(seriesElement, "c:tx");

  if (!tx) {
    return;
  }

  const stringCache = tx.getElementsByTagName("c:strCache")[0];

  if (stringCache) {
    updateStringCache(stringCache, [name]);
    return;
  }

  const valueElement = tx.getElementsByTagName("c:v")[0];

  if (valueElement) {
    valueElement.textContent = name;
  }
}

function updateSeriesCategories(
  seriesElement: Element,
  categories: string[]
) {
  const cat = getFirstChildByTag(seriesElement, "c:cat");

  if (!cat) {
    return;
  }

  const stringCache = cat.getElementsByTagName("c:strCache")[0];

  if (stringCache) {
    updateStringCache(stringCache, categories);
    return;
  }

  const numberCache = cat.getElementsByTagName("c:numCache")[0];

  if (numberCache) {
    updateNumberCache(
      numberCache,
      categories.map((_, index) => index + 1)
    );
  }
}

function updateSeriesValues(seriesElement: Element, values: number[]) {
  const val = getFirstChildByTag(seriesElement, "c:val");

  if (!val) {
    return;
  }

  const numberCache = val.getElementsByTagName("c:numCache")[0];

  if (!numberCache) {
    return;
  }

  updateNumberCache(numberCache, values);
}

export function updateNativeChartCache({
  chartXml,
  categories,
  series,
}: {
  chartXml: string;
  categories: string[];
  series: ChartSeries[];
}) {
  const document = parseXml(chartXml);

  const seriesElements = Array.from(
    document.getElementsByTagName("c:ser")
  );

  series.forEach((item, index) => {
    const seriesElement = seriesElements[index];

    if (!seriesElement) {
      return;
    }

    updateSeriesName(seriesElement, item.name);
    updateSeriesCategories(seriesElement, categories);
    updateSeriesValues(seriesElement, item.values);
  });

  return serializeXml(document);
}