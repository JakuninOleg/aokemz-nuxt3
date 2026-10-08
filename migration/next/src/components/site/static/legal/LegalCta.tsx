import { LEGAL_CTA } from '@/lib/static-content/legal';
import { CtaBand } from '../CtaBand';

export function LegalCta() {
  return (
    <CtaBand
      title={LEGAL_CTA.title}
      lead={LEGAL_CTA.lead}
      image={LEGAL_CTA.image}
      imageAlt={LEGAL_CTA.imageAlt}
      buttonLabel="Связаться"
      aside={LEGAL_CTA.aside}
      titleId="legal-cta-title"
    />
  );
}
