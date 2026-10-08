import { PRODUCTS_CTA } from '@/lib/catalog-content';
import { CatalogCtaBand } from './CatalogCtaBand';

export function ProductsCta() {
  return (
    <CatalogCtaBand
      className="catalog-cta"
      title={PRODUCTS_CTA.title}
      lead={PRODUCTS_CTA.lead}
      image={PRODUCTS_CTA.image}
      imageAlt={PRODUCTS_CTA.imageAlt}
      buttonLabel={PRODUCTS_CTA.button}
      titleId="products-cta-title"
    />
  );
}
