export function DocumentsFileIcon({ ext }: { ext: 'PDF' | 'DOCX' | string }) {
  return (
    <span className="docs-file-icon" data-ext={ext} aria-hidden="true">
      <svg viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8 2h18l10 10v32a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4Z"
          fill="#EEF4FB"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M26 2v8a2 2 0 0 0 2 2h8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <span className="docs-file-icon__badge">{ext}</span>
    </span>
  );
}
