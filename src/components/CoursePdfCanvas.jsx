"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function CoursePdfCanvas({ pdfUrl, title, onLoad, onError, lang = "en" }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [numPages, setNumPages] = useState(0);

  const t = {
    error: lang === "hi" ? "PDF लोड नहीं हो सकी। नीचे बटन से खोलें।" : "Could not load PDF. Use the button below to open it.",
  };

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    const measure = () => setWidth(node.clientWidth);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleLoadSuccess = useCallback(
    ({ numPages: total }) => {
      setNumPages(total);
      onLoad?.();
    },
    [onLoad]
  );

  return (
    <div ref={containerRef} className="course-pdf-modal__canvas">
      <Document
        file={pdfUrl}
        onLoadSuccess={handleLoadSuccess}
        onLoadError={onError}
        loading={null}
        error={<p className="course-pdf-modal__canvas-error">{t.error}</p>}
      >
        {width > 0 &&
          Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`page-${index + 1}`}
              pageNumber={index + 1}
              width={width}
              className="course-pdf-modal__page"
              renderTextLayer
              renderAnnotationLayer
              aria-label={`${title} — page ${index + 1}`}
            />
          ))}
      </Document>
    </div>
  );
}
