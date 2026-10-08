import { CATEGORY_CTA } from '@/lib/catalog-content';
import { CatalogCtaBand } from './CatalogCtaBand';

export function CategoryCta() {
  return (
    <CatalogCtaBand
      className="category-cta"
      title={CATEGORY_CTA.title}
      lead={CATEGORY_CTA.lead}
      image={CATEGORY_CTA.image}
      imageAlt={CATEGORY_CTA.imageAlt}
      buttonLabel={CATEGORY_CTA.button}
      aside={CATEGORY_CTA.aside}
      titleId="category-cta-title"
    />
  );
}
