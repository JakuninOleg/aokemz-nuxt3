import { HomeEngineeringIcon } from '@/components/site/home/HomeEngineeringIcon';
import type { PublicMedia } from '@/lib/public-content';

export function CategoryDocuments({ files }: { files: PublicMedia[] }) {
  if (!files.length) return null;
  return (
    <section id="category-documents" className="ref-container category-documents" aria-labelledby="category-docs-title">
      <h2 id="category-docs-title">Документация</h2>
      <p>Опросные листы и справочные материалы для подбора и эксплуатации оборудования.</p>
      <div className="category-documents__grid">
        {files.map((file) => (
          <a key={file.id} href={file.url} target="_blank" rel="noopener noreferrer">
            <HomeEngineeringIcon name="document" />
            <span>{file.title || file.filename || 'Документ'}</span>
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}
