import { DOCUMENTS_LIST } from '@/lib/static-content/documents';
import type { CmsDocumentItem } from '@/lib/static-content/documents-query';
import { DocumentsFileIcon } from './DocumentsFileIcon';

const pad = (index: number) => String(index + 1).padStart(2, '0');

type ListRow = {
  key: string;
  title: string;
  href: string;
  ext: string;
  note: string;
};

export function DocumentsList({ cmsDocuments = [] }: { cmsDocuments?: CmsDocumentItem[] }) {
  const localKeys = new Set(DOCUMENTS_LIST.map((d) => d.href));
  const rows: ListRow[] = [
    ...DOCUMENTS_LIST.map((d) => ({
      key: d.href,
      title: d.title,
      href: d.href,
      ext: d.ext,
      note: d.note,
    })),
    ...cmsDocuments
      .filter((d) => d.href && !localKeys.has(d.href))
      .map((d) => ({
        key: `cms-${d.id}`,
        title: d.title,
        href: d.href,
        ext: d.ext,
        note: d.note,
      })),
  ];

  return (
    <section className="docs-list" aria-labelledby="docs-list-title">
      <div className="ref-container">
        <h2 id="docs-list-title" className="visually-hidden">
          Файлы для скачивания
        </h2>
        <ul className="docs-list__rows">
          {rows.map((doc, index) => (
            <li key={doc.key}>
              <a
                className="docs-row"
                href={doc.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="docs-row__index">{pad(index)}</span>
                <DocumentsFileIcon ext={doc.ext} />
                <span className="docs-row__copy">
                  <strong>{doc.title}</strong>
                  {doc.note ? <small>{doc.note}</small> : null}
                </span>
                <span className="docs-row__action">
                  <span className="docs-row__action-label">Открыть</span>
                  <span className="docs-row__action-icon" aria-hidden="true">
                    ↗
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
