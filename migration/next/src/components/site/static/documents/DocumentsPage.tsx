import type { CmsDocumentItem } from '@/lib/static-content/documents-query';
import { DocumentsCta } from './DocumentsCta';
import { DocumentsHero } from './DocumentsHero';
import { DocumentsList } from './DocumentsList';

export function DocumentsPage({ cmsDocuments = [] }: { cmsDocuments?: CmsDocumentItem[] }) {
  return (
    <div className="kemz-home kemz-docs">
      <DocumentsHero />
      <DocumentsList cmsDocuments={cmsDocuments} />
      <DocumentsCta />
    </div>
  );
}
