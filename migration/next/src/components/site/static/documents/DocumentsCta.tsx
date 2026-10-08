import { DOCUMENTS_CTA } from '@/lib/static-content/documents';
import { CtaBand } from '../CtaBand';

export function DocumentsCta() {
  return (
    <CtaBand
      title={DOCUMENTS_CTA.title}
      lead={DOCUMENTS_CTA.lead}
      image={DOCUMENTS_CTA.image}
      imageAlt={DOCUMENTS_CTA.imageAlt}
      buttonLabel={DOCUMENTS_CTA.button}
      aside={DOCUMENTS_CTA.aside}
      titleId="docs-cta-title"
    />
  );
}
