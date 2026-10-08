import { DocumentsPage } from '@/components/site/static/documents/DocumentsPage';
import { JsonLd } from '@/components/site/Content';
import { DOCUMENTS_HERO } from '@/lib/static-content/documents';
import { publishedDocuments } from '@/lib/static-content/documents-query';
import { breadcrumbJsonLd, PAGE_SEO, pageMetadata } from '@/lib/static-content/page-seo';

export const dynamic = 'force-dynamic';

export const metadata = pageMetadata({
  ...PAGE_SEO.documents,
  ogImage: `https://aokemz.ru${DOCUMENTS_HERO.image}`,
});

export default async function DocumentsRoute() {
  const cmsDocuments = await publishedDocuments();

  return (
    <>
      <link rel="preload" as="image" href={DOCUMENTS_HERO.image} type="image/webp" />
      <JsonLd
        value={breadcrumbJsonLd([
          { name: 'Главная', path: '/' },
          { name: 'Документы', path: '/documents' },
        ])}
      />
      <DocumentsPage cmsDocuments={cmsDocuments} />
    </>
  );
}
import '@/styles/legacy/documents.scss';
